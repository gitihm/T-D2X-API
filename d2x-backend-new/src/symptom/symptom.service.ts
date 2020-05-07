import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { SymptomTest, From } from './model/symptom.model';
import { QuestionTest, ChoiceTest } from '../question/model/questiontest.model';
import { QuestionService } from '../question/question.service';
import { ChartSymptom } from '../chart/model/chart.model';
import { ChartService } from '../chart/chart.service';
import { Config } from '../config/config';

const axios = require('axios');
@Injectable()
export class SymptomService {
  constructor(
    @Inject('symptomRepo') private readonly symptomRepo: typeof SymptomTest,
    @Inject('fromRepo') private readonly fromRepo: typeof From,
    @Inject('ChartSymptomRepo')
    private readonly chartSymptomRepo: typeof ChartSymptom,
    private readonly questionService: QuestionService,
    private readonly chartService: ChartService,
  ) {}
  async get_all_symptom() {
    let data = await this.symptomRepo.findAll({ raw: true });
    return this.string2arr(data);
  }
  async get_symptom(disease_id: number) {
    let data = await this.symptomRepo.findAll({
      where: { disease_id },
      raw: true,
    });
    return this.string2arr(data);
  }
  async del_symptom(symptom_id: number) {
    let data = await this.symptomRepo.findOne({
      where: { symptom_id },
      raw: true,
    });
    await this.chartService.delete_sub_data_chart(2, symptom_id);
    await this.update_formData(data.disease_id , symptom_id)
    
    await this.symptomRepo.destroy({ where: { symptom_id } });
    return await this.get_symptom(data.disease_id);
  }
  async update_formData(disease_id : number , symptom_id : number){
    let formData = await this.fromRepo.findOne({
      where: { disease_id },
      raw: true,
    });
    let choiceNeed = Array.from(JSON.parse(formData.choice));
    choiceNeed = choiceNeed.filter(v=>{
      let detail = this.datavalue2json(v)
     return detail.symptom_id != symptom_id
      
    })
    await this.fromRepo.update(
      { choice: JSON.stringify(choiceNeed) },
      { where: { disease_id } },
    );
  }
  private async string2arr(data: any) {
    let promises = [];
    data.forEach(v => {
      promises.push(this.processString2Arr(v));
    });
    return await Promise.all(promises);
  }
  private async processString2Arr(data: any) {
    data.name = JSON.parse(data.name);
    return data;
  }
  private async check_get_q(disease_id: number) {
    const question = await this.questionService.getQuestions(
      ['choice'],
      disease_id,
    );
    let q = this.questionService.datavalue2array(question);
    return q.length;
    
  }

  private check_type_choice(choice: any) {
    let multi_choice = 0;
    choice.forEach(item => {
      if (item.length > 1) {
        multi_choice++;
      }
    });
    if (multi_choice > 1) {
      return 1; // multi
    } else {
      return 0; //single
    }
  }
  async step_first(disease_id: number, symptom: any) {
    let s = await this.have_symptom(symptom, disease_id);
    let formData = await this.fromRepo.findOne({
      where: { disease_id },
      raw: true,
    });
    if (!formData) {
      let choice = { symptom_id: s.symptom_id, choice: symptom.choice };
      let arr = [choice];
      await this.fromRepo.create({
        choice: JSON.stringify(arr),
        disease_id,
      });
    } else {
      let choice = { symptom_id: s.symptom_id, choice: symptom.choice };
      let choiceNeed = Array.from(JSON.parse(formData.choice));
      choiceNeed.push({ ...choice });
      await this.fromRepo.update(
        { choice: JSON.stringify(choiceNeed) },
        { where: { disease_id } },
      );
    }
  }
  async train(disease_id: number) {
    let formData = await this.fromRepo.findOne({
      where: { disease_id },
      raw: true,
    });
    var data = {
      single: [],
      multi: [],
      size_question: 0,
      real_data: [],
    };
    let symptomChoice = Array.from(JSON.parse(formData.choice));
    for (let index = 0; index < symptomChoice.length; index++) {
      data = await this.create_symptom(disease_id, symptomChoice[index], data);
    }
    data = await this.check_same_data([], disease_id, 2, data);
    return await this.genera_symptom(disease_id, data);
  }
  async create_symptom(disease_id: number, symptom: any, dataForTrain: any) {
    dataForTrain.size_question = await this.check_get_q(disease_id);

    let type_choice = this.check_type_choice(symptom.choice);

    let choice = JSON.parse(
      JSON.stringify(this.cartesian_product(symptom.choice), null, 4),
    );
    let pre_csv = this.check_count_choice(choice, dataForTrain.size_question);
    pre_csv = this.add_answer_in_choice(pre_csv, symptom.symptom_id);
    dataForTrain = await this.check_same_data(
      pre_csv,
      disease_id,
      type_choice,
      dataForTrain,
    );


    return dataForTrain;
  }

  private async have_symptom(symptom: any, disease_id: number) {
    let data = await this.symptomRepo.findOne({
      where: { name: symptom.name, suggestion: symptom.suggestion, disease_id },
      raw: true,
    });

    if (data) {
      return data;
    } else {
      let symptomCreate = JSON.parse(
        JSON.stringify(
          await this.symptomRepo.create({
            name: symptom.name,
            suggestion: symptom.suggestion,
            disease_id,
          }),
          null,
          4,
        ),
      );
      await this.chartService.create_null_chart_data(2, {
        symptom_id: symptomCreate.symptom_id,
        disease_id,
      });
      return symptomCreate;
    }
  }
  private check_count_choice(choice: any, sizeQ: number) {
    return choice.map(item => {
      if (item.length == sizeQ) {
        return item;
      } else {
        let new_item = [];
        for (let i = 0; i < sizeQ; i++) {
          if (item[i] != undefined) {
            new_item.push(item[i]);
          } else {
            new_item.push(99);
          }
        }

        return new_item;
      }
    });
  }
  private sortCols(a, b, attrs) {
    return Object.keys(attrs).reduce(
      (diff, k) => (diff == 0 ? attrs[k](a[k], b[k]) : diff),
      0,
    );
  }
  private async check_same_data(
    pre_csv: any,
    disease_id: number,
    type_choice: number,
    data: any,
  ) {
    const fuc_in_sort = (a, b) => a - b;
    if (type_choice == 0) {
      // single
      let tmp_pre_csv = pre_csv.map(item => item.slice(0, data.size_question));
      let tmp_pre_data_csv = data.single.map(item =>
        item.slice(0, data.size_question),
      );
      if (tmp_pre_data_csv.length == 0) {
        data.single.push(...pre_csv);
      } else {
        tmp_pre_csv.forEach((m, i) => {
          let index = tmp_pre_data_csv.map((mm, ii) => {
            if (JSON.stringify(m) != JSON.stringify(mm)) {
              return i;
            }
          });
          let undefined_status = index.findIndex(item => item == undefined);
          if (undefined_status == -1) {
            data.single.push(pre_csv[index[0]]);
          }
        });
      }

      var new_cases = {};
      for (let i = 0; i < data.size_question; i++) {
        new_cases[`${i}`] = fuc_in_sort;
      }
      data.single.sort((a, b) => this.sortCols(a, b, new_cases));
      return data;
    } else if (type_choice == 1) {
      //multi
      let tmp_pre_csv = pre_csv.map(item => item.slice(0, data.size_question));
      let tmp_pre_data_csv = data.multi.map(item =>
        item.slice(0, data.size_question),
      );
      if (tmp_pre_data_csv.length == 0) {
        data.multi.push(...pre_csv);
      } else {
        tmp_pre_csv.forEach((m, i) => {
          let index = tmp_pre_data_csv.map((mm, ii) => {
            if (JSON.stringify(m) != JSON.stringify(mm)) {
              return i;
            }
          });
          let undefined_status = index.findIndex(item => item == undefined);
          if (undefined_status == -1) {
            data.multi.push(pre_csv[index[0]]);
          }
        });
      }
      var new_cases = {};
      for (let i = 0; i < data.size_question; i++) {
        new_cases[`${i}`] = fuc_in_sort;
      }
      data.multi.sort((a, b) => this.sortCols(a, b, new_cases));
      return data;
    } else if (type_choice == 2) {
      if (data.single.length != 0) {
        data.real_data.push(...data.single);
        let tmp_pre_csv = data.multi.map(item =>
          item.slice(0, data.size_question),
        );
        let tmp_pre_data_csv = data.real_data.map(item =>
          item.slice(0, data.size_question),
        );
        tmp_pre_csv.forEach((m, i) => {
          let index = tmp_pre_data_csv.map((mm, ii) => {
            if (JSON.stringify(m) != JSON.stringify(mm)) {
              return i;
            }
          });
          let undefined_status = index.findIndex(item => item == undefined);
          if (undefined_status == -1) {
            data.real_data.push(data.multi[index[0]]);
          }
        });

        var new_cases = {};
        for (let i = 0; i < data.size_question; i++) {
          new_cases[`${i}`] = fuc_in_sort;
        }
        data.real_data.sort((a, b) => this.sortCols(a, b, new_cases));
      } else {

        data.real_data.push(...data.multi);
      }
      return data;
    }
  }
  private cartesian_product = arr => {
    return arr.reduce(
      (a, b) => {
        return a
          .map(x => {
            return b.map(y => {
              return x.concat([y]);
            });
          })
          .reduce((a, b) => {
            return a.concat(b);
          }, []);
      },
      [[]],
    );
  };
  private add_answer_in_choice = (choices: any, answer: number) => {
    return choices.map(choice => {
      return [...choice, answer];
    });
  };
  async genera_symptom(disease_id: number, data: any) {
    let label = this.create_label(data.size_question);

    if (data.real_data.length < 50) {
      data.real_data.push(...data.real_data);
    }


    let a = axios.post(`http://localhost:${Config.ml.port}/ml`, {
      from: data.real_data,
      disease_id: disease_id,
      label,
    });
    return { message: 'running', a: a.data };
  }
  private create_label = count => {
    let name = 'choice';
    let label = [];
    for (let i = 1; i <= count; i++) {
      label.push(name + i);
    }
    label.push('answer');
    return label;
  };
  private datavalue2json(data: any) {
    return JSON.parse(JSON.stringify(data, null, 4));
  }
}

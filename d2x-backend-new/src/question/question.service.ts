import { Injectable, Inject } from '@nestjs/common';
import { QuestionTest, ChoiceTest } from './model/questiontest.model';
import { DiseaseHeader } from '../disease/model/disease.model';
import * as _ from 'lodash';
import * as request from 'request';
import { MESSAGE } from '../config/message/global.configure';
@Injectable()
export class QuestionService {
  constructor(
    @Inject('questionRepo') private readonly questionRepo: typeof QuestionTest,
    @Inject('choiceRepo') private readonly choiceRepo: typeof ChoiceTest,
    @Inject('diseaseheaderRepo')
    private readonly diseaseheaderRepo: typeof DiseaseHeader,
  ) {
    this.questionRepo.addScope('choice', {
      include: [{ model: choiceRepo, separate: true, as: 'choices' }],
    });
  }
  async getQuestions(options: any, disease_id: number) {
    return await this.questionRepo
      .scope(options)
      .findAll({ where: { disease_id } });
  }
  async create_questions(questions: any, choices: any, disease_id: number) {
    if (await this.check_disease(disease_id)) {
      return MESSAGE.NOT_HAVE_DISEASE;
    }
    await this.delete_question(disease_id);
    let q_id = await this.create_question(questions, disease_id);
    let list_id = this.set_list_id_q(questions);
    choices = await this.set_arr_choice(choices, list_id);
    choices = this.map_q_id_choice(q_id, choices);
    let c_id = await this.create_choice(choices);
    return await this.questionRepo
      .scope(['choice'])
      .findAll({ where: { disease_id, question_id: q_id } });
  }
  private async check_disease(disease_id: number) {
    let result = await this.diseaseheaderRepo.findByPk(disease_id, {
      raw: true,
    });
    return !result ? true : false;
  }
  private set_list_id_q(questions: any) {
    return questions.map(item => {
      return item.list_id;
    });
  }
  private async delete_question(disease_id: number) {
    let q = await this.questionRepo.findAll({
      where: { disease_id },
      raw: true,
    });
    if (q.length != 0)
      await this.questionRepo.destroy({ where: { disease_id } });
  }
  private async create_question(questions: any, disease_id: number) {
    const promise = [];
    questions.forEach(element => {
      promise.push(this.put_db_question({ ...element, disease_id }));
    });
    return await Promise.all(promise);
  }
  private async put_db_question(question: any) {
    let result = await this.questionRepo.create(question);
    return this.datavalue2array(result.question_id);
  }
  private map_q_id_choice(keys: any, values: any) {
    let result = values.map((v, i) =>
      v.map(o => ((o.question_id = keys[i]), o)),
    );
    return _.flatMap(result);
  }
  datavalue2array(data: any) {
    return JSON.parse(JSON.stringify(data, null, 4));
  }
  private async set_arr_choice(choices: any, list_id: any) {
    const promise = [];
    list_id.forEach(element => {
      promise.push(this.find_choice_in_q(element, choices));
    });
    let result = await Promise.all(promise);
    return result;
  }
  private find_choice_in_q(list_id: any, choices: any) {
    return choices.filter(item => {
      return item.list_id == list_id;
    });
  }
  private async create_choice(choices: any) {
    const promise = [];
    choices.forEach(element => {
      promise.push(this.put_db_choice(element));
    });
    return await Promise.all(promise);
  }
  private async put_db_choice(choice: any) {
    let result = await this.choiceRepo.create(choice);
    return this.datavalue2array(result);
  }
  async getTest() {
    let a = new Promise(function(resolve, reject) {
      request.get('http://localhost:9999/ml', (err, response, body) => {
        if (err) return reject(err);
        try {
          resolve(response.body);
        } catch (e) {
          reject(e);
        }
      });
    });
    return await a
      .then(v => {

        return v;
      })
      .catch(e => {
        return e;
      });
  }
  async find_choice(choice_id : any){
    return await this.choiceRepo.findOne({where:{chioce_id:choice_id},raw:true})

  }
}

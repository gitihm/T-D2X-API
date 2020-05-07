import { Injectable, Inject } from '@nestjs/common';
const axios = require('axios');
import {
  ChartGeneral,
  ChartSymptom,
  ChartProduct,
  ChartMonth,
  ChartYear,
  ChartOrder,
} from '../chart/model/chart.model';
import { SymptomTest } from '../symptom/model/symptom.model';
import {
  QuestionTest,
  ChoiceTest,
} from '../question/model/questiontest.model';
import { MapProduct } from '../symptom/model/map.product.model';
import { Product } from '../product/model/product.model';
import { ChartService } from 'src/chart/chart.service';
import { TasksService } from '../tasks/tasks.service';

var moment = require('moment');
@Injectable()
export class ConcludeService {
  constructor(
    @Inject('SymptomTestRepo')
    private readonly symptomTestRepo: typeof SymptomTest,
    @Inject('choiceRepo')
    private readonly choiceRepo: typeof ChoiceTest,
    @Inject('questionRepo')
    private readonly questionRepo: typeof QuestionTest,
    @Inject('mapProductRepo')
    private readonly mapProductRepo: typeof MapProduct,
    @Inject('productRepo')
    private readonly productRepo: typeof Product,
    private readonly chartService: ChartService,
    private readonly TasksService: TasksService,
  ) {}
  async find_detail(choice: any) {
    const promise = [];
    choice.forEach(element => {
      promise.push(this.find_choice(element));
    });
    return await Promise.all(promise);
  }
  async find_choice(choice_id: any) {
    let result = await this.choiceRepo.findOne({
      where: { chioce_id: choice_id },
      raw: true,
    });
    return result.history;
  }
  private async get_count_choice(choice: any, disease_id: number) {
    let q = await this.questionRepo.findAll({
      where: { disease_id },
      raw: true,
    });
    if (choice.length === q.length) return choice;
    else {
      for (let i = 0; i < q.length; i++) {
        if (choice[i] == undefined) {
          choice[i] = 99;
        }
      }
      return choice;
    }
  }
  private async get_product(id: number) {
    let id_product = await this.mapProductRepo.findAll({
      where: { symptom_id: id },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
      raw: true,
    });
    id_product = id_product.map(item => {
      return item.product_id;
    });
    let product = [],
      promise = [];
    id_product.forEach(item => {
      promise.push(this.get_product_by_id(item));
    });
    let result = await Promise.all(promise);
    return result;
  }
  async get_product_by_id(product_id: number) {
    return await this.productRepo.findOne({
      where: { product_id },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
      raw: true,
    });
  }
  async findSymptom(choice: any, disease_id: number) {
    let symptom = await this.find_detail(choice);
    let port = disease_id * 1000 + 148;
    choice = await this.get_count_choice(choice, disease_id);
    let res = await axios.post(`http://localhost:${port}/`, { code: choice });
    let s_result = await this.symptomTestRepo.findOne({
      where: { symptom_id: res.data.result },
      raw: true,
    });
    try {
      await this.chartService.increment_symptom(res.data.result, disease_id);
      await this.chartService.increment_general(disease_id, symptom);
    } catch (error) {
    
      await this.TasksService.create_null_chart_day()
      await this.chartService.increment_symptom(res.data.result, disease_id);
      await this.chartService.increment_general(disease_id, symptom);
    }

    let product = await this.get_product(res.data.result);
    if (disease_id == 21) {
      s_result.name = JSON.parse(s_result.name);
      let result_one = { name: '', test: [] },
        result_two = { name: '', test: [] };

      result_one.name = s_result.name[1];

      result_two.name = s_result.name[2];
      s_result.suggestion,
        symptom.forEach((item, index) => {
          if (index > 1 && index < 5) {
            if (!item.includes('ไม่')) {

              result_two.test.push(item);
            }
          } else if (index > 4) {
            if (!item.includes('ไม่')) {

              result_one.test.push(item);
            }
          }
        });

     
      let new_s_result = [
        { name: s_result.name[0], detail: [] },
        { name: result_one.name, detail: result_one.test },
        { name: result_two.name, detail: result_two.test },
      ];
      s_result.name = new_s_result;
    } else {
      s_result.name = JSON.parse(s_result.name);
      s_result.name = [{ name: s_result.name[0], detail: [] }];
    }
  

    return {
      finding: s_result.name,
      suggestion: s_result.suggestion,
      symptom,
      products: product,
    };
  }
}

import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, Interval, Timeout, NestSchedule } from 'nest-schedule';
import {
  ChartGeneral,
  ChartSymptom,
  ChartProduct,
  ChartMonth,
  ChartYear,
  ChartOrder,
  ChartUser,
} from '../chart/model/chart.model';
import { SymptomTest } from 'src/symptom/model/symptom.model';
import { Product } from 'src/product/model/product.model';
import { DiseaseHeader } from 'src/disease/model/disease.model';
var moment = require('moment');
@Injectable()
export class TasksService extends NestSchedule {
  @Inject('ChartGeneralRepo')
  private readonly chartGeneralRepo: typeof ChartGeneral;
  @Inject('ChartSymptomRepo')
  private readonly chartSymptomRepo: typeof ChartSymptom;
  @Inject('ChartProductRepo')
  private readonly chartProductRepo: typeof ChartProduct;
  @Inject('ChartMonthRepo')
  private readonly chartMonthRepo: typeof ChartMonth;
  @Inject('ChartYearRepo')
  private readonly chartYearRepo: typeof ChartYear;
  @Inject('ChartOrderRepo')
  private readonly chartOrderRepo: typeof ChartOrder;
  @Inject('ChartUserRepo')
  private readonly chartUserRepo: typeof ChartUser;
  @Inject('ProductRepo')
  private readonly productRepo: typeof Product;
  @Inject('SymptomTestRepo')
  private readonly symptomRepo: typeof SymptomTest;
  @Inject('diseaseheaderRepo')
  private readonly diseaseheaderRepo: typeof DiseaseHeader;

  private readonly logger = new Logger(TasksService.name);

  private get_date() {
    var datetime = new Date();
    let date = moment(datetime)
      .tz('Asia/Bangkok')
      .format();

    date = date.split('T')[0].split('-');
    let day = date[2] + '/' + date[1] + '/' + date[0];
    let month = date[1] + '/' + date[0];
    let year = date[0];
    return { day, month, year };
  }
  private async get_id() {
    let p = await this.productRepo.findAll({
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'name',
          'photo',
          'sold',
          'price',
          'help',
          'description',
          'category',
          'quantity',
          'company',
        ],
      },
    });
    let s = await this.symptomRepo.findAll({
      raw: true,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'name', 'suggestion'],
      },
    });
    let h = await this.diseaseheaderRepo.findAll({
      raw: true,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'name', 'status'],
      },
    });

    return { product: p, symptom: s, header: h };
  }
  private datavalue2json(data: any) {
    return JSON.parse(JSON.stringify(data, null, 4));
  }
  private async create_year(year: string) {
    let y = await this.chartYearRepo.findOne({ where: { year }, raw: true });
    if (!y) {
      return this.datavalue2json(await this.chartYearRepo.create({ year }));
    } else {
      return y;
    }
  }
  private async create_month(date: string, chart_y_id: number) {
    let res = await this.chartMonthRepo.findOne({
      where: { date, chart_y_id },
      raw: true,
    });
    if (!res) {
      return this.datavalue2json(
        await this.chartMonthRepo.create({ date, chart_y_id }),
      );
    } else {
      return res;
    }
  }
  private async create_user(date: string, chart_m_id: number) {
    let res = await this.chartUserRepo.findOne({
      where: { date, chart_m_id },
      raw: true,
    });
    if (!res) {
      await this.chartUserRepo.create({ date, count: 0, chart_m_id });
    }
  }
  private async create_order(date: string, chart_m_id: number) {
    let res = await this.chartOrderRepo.findOne({
      where: { date, chart_m_id },
      raw: true,
    });
    if (!res) {
      await this.chartOrderRepo.create({ date, count: 0, chart_m_id });
    }
  }
  private async product(date: string, chart_m_id: number, products: any) {
    let promises = [];
    products.forEach(element => {
      promises.push(this.create_product(date, chart_m_id, element.product_id,element.disease_id));
    });
    await Promise.all(promises);
  }
  private async create_product(
    date: string,
    chart_m_id: number,
    product_id: number,
    disease_id : number
  ) {
    let res = await this.chartProductRepo.findOne({
      where: { date, chart_m_id, product_id },
      raw: true,
    });
    if (!res) {
      if(!disease_id) disease_id=1
      await this.chartProductRepo.create({
        date,
        count: 0,
        chart_m_id,
        product_id,
        disease_id
      });
    }
  }
  private async symptom(date: string, chart_m_id: number, symptoms: any) {
    let promises = [];
    symptoms.forEach(element => {
      promises.push(this.create_symptoms(date, chart_m_id, element));
    });
    await Promise.all(promises);
  }
  private async create_symptoms(
    date: string,
    chart_m_id: number,
    symptom: any,
  ) {
    let res = await this.chartSymptomRepo.findOne({
      where: {
        date,
        chart_m_id,
        symptom_id: symptom.symptom_id,
        disease_id: symptom.disease_id,
      },
      raw: true,
    });
    if (!res) {
      await this.chartSymptomRepo.create({
        date,
        count: 0,
        chart_m_id,
        symptom_id: symptom.symptom_id,
        disease_id: symptom.disease_id,
      });
    }
  }
  private async general(date: string, chart_m_id: number, headers: any) {
    let promises = [];
    headers.forEach(element => {
      promises.push(this.create_general(date, chart_m_id, element.disease_id));
    });
    await Promise.all(promises);
  }
  private async create_general(
    date: string,
    chart_m_id: number,
    disease_id: number,
  ) {
    let res = await this.chartGeneralRepo.findOne({
      where: {
        date,
        chart_m_id,
        disease_id: disease_id,
      },
      raw: true,
    });
    if (!res) {
      await this.chartGeneralRepo.create({
        date,
        male: 0,
        female: 0,
        child: 0,
        adult: 0,
        elderly: 0,
        chart_m_id,
        disease_id: disease_id,
      });
    }
  }
  @Cron('5 0 0 * * *', {
    startTime: new Date(),
  })
  async create_null_chart_day() {
    let date = this.get_date();
    let id = await this.get_id();

    let year = await this.create_year(date.year);
    let chart_y_id = year.chart_y_id;
    let month = await this.create_month(date.month, chart_y_id);
    let chart_m_id = month.chart_m_id;
    let promises = []
    promises.push(this.create_user(date.day, chart_m_id))
    promises.push(this.create_order(date.day, chart_m_id))
    promises.push(this.product(date.day, chart_m_id, id.product))
    promises.push(this.symptom(date.day, chart_m_id, id.symptom))
    promises.push(this.general(date.day, chart_m_id, id.header))
    await Promise.all(promises)
  }
  @Timeout(5000)
  async onceJob() {
    this.logger.debug('#INITAL TASK RUNNING ');
  }
}

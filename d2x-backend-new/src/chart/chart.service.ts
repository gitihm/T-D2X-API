import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import {
  ChartGeneral,
  ChartSymptom,
  ChartProduct,
  ChartMonth,
  ChartYear,
  ChartOrder,
  ChartUser,
} from './model/chart.model';
import { Product } from '../product/model/product.model';
import { SymptomTest } from '../symptom/model/symptom.model';
import { DiseaseHeader } from '../disease/model/disease.model';
var moment = require('moment');
var _ = require('lodash');

@Injectable()
export class ChartService {
  constructor(
    @Inject('ChartGeneralRepo')
    private readonly chartGeneralRepo: typeof ChartGeneral,
    @Inject('ChartSymptomRepo')
    private readonly chartSymptomRepo: typeof ChartSymptom,
    @Inject('ChartProductRepo')
    private readonly chartProductRepo: typeof ChartProduct,
    @Inject('ChartMonthRepo')
    private readonly chartMonthRepo: typeof ChartMonth,
    @Inject('ChartYearRepo')
    private readonly chartYearRepo: typeof ChartYear,
    @Inject('ChartOrderRepo')
    private readonly chartOrderRepo: typeof ChartOrder,
    @Inject('ChartUserRepo')
    private readonly chartUserRepo: typeof ChartUser,
    @Inject('ProductRepo')
    private readonly productRepo: typeof Product,
    @Inject('SymptomTestRepo')
    private readonly symptomRepo: typeof SymptomTest,
    @Inject('diseaseheaderRepo')
    private readonly diseaseheaderRepo: typeof DiseaseHeader,
  ) {
    this.chartSymptomRepo.addScope('chartsymptom', {
      include: [{ model: SymptomTest, separate: true, as: 'symtom' }],
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'disease_id',
          'date',
          'chart_symptom_id',
        ],
      },
    });
  }
  get_date() {
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
  private datavalue2json(data: any) {
    return JSON.parse(JSON.stringify(data, null, 4));
  }
  private sting2json(data: any) {
    return JSON.parse(data);
  }

  async increment_user() {
    let date = this.get_date();
    let data = await this.chartUserRepo.findOne({
      where: { date: date.day },
      raw: true,
    });
    let counting = data.count + 1;
    await this.chartUserRepo.update(
      { count: counting },
      { where: { date: date.day } },
    );
  }
  async increment_order() {
    let date = this.get_date();
    let data = await this.chartOrderRepo.findOne({
      where: { date: date.day },
      raw: true,
    });
    let counting = data.count + 1;
    await this.chartOrderRepo.update(
      { count: counting },
      { where: { date: date.day } },
    );
  }
  async increment_product(product_id: number) {
    let date = this.get_date();
    let data = await this.chartProductRepo.findOne({
      where: { date: date.day, product_id },
      raw: true,
    });
    let counting = data.count + 1;
    await this.chartProductRepo.update(
      { count: counting },
      { where: { date: date.day, product_id } },
    );
  }
  async increment_symptom(symptom_id: number, disease_id: number) {
    let date = this.get_date();
    let data = await this.chartSymptomRepo.findOne({
      where: { date: date.day, symptom_id, disease_id },
      raw: true,
    });
    let counting = data.count + 1;
    await this.chartSymptomRepo.update(
      { count: counting },
      { where: { date: date.day, symptom_id, disease_id } },
    );
  }
  async increment_general(disease_id: number, detail_symptom: any) {
    let date = this.get_date();
    let data = await this.chartGeneralRepo.findOne({
      where: { date: date.day, disease_id },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'disease_id',
          'date',
          'chart_general_id',
        ],
      },
    });
    let counting = { male: 0, female: 0, child: 0, adult: 0, elderly: 0 };

    if (disease_id == 1) {
      let child = this.areEqual(
        'อายุน้อยกว่า 15 ปี',
        this.datavalue2json(detail_symptom[1]),
      );
      let adult = this.areEqual(
        'อายุมากกว่า 15 ปี แต่ไม่เกิน  65 ปี',
        this.datavalue2json(detail_symptom[1]),
      );
      let elderly = this.areEqual(
        'อายุมากกว่า  65 ปี',
        this.datavalue2json(detail_symptom[1]),
      );
      let male = false,
        female = false;
      if (adult) {
        male = this.areEqual('เพศชาย', this.datavalue2json(detail_symptom[2]));
        female = this.areEqual(
          'เพศหญิง',
          this.datavalue2json(detail_symptom[2]),
        );
      }
      if (child) {
        counting.child = data.child + 1;
      } else if (adult) {
        counting.adult = data.adult + 1;
        if (male) {
          counting.male = data.male + 1;
        } else if (female) {
          counting.female = data.female + 1;
        }
      } else if (elderly) {
        counting.elderly = data.elderly + 1;
      }
    } else if (disease_id == 21) {
      let adult = this.areEqual(
        'อายุน้อยกว่า 60 ปี',
        this.datavalue2json(detail_symptom[0]),
      );
      let elderly = this.areEqual(
        'อายุมากกว่า 60 ปี',
        this.datavalue2json(detail_symptom[0]),
      );
      if (adult) {
        counting.adult = data.adult + 1;
      } else if (elderly) {
        counting.elderly = data.elderly + 1;
      }
    }

    await this.chartGeneralRepo.update(
      { ...counting },
      { where: { date: date.day, disease_id } },
    );
  }

  private areEqual = (a, b) => {
    a = a.trim();
    b = b.trim();
    if (a.length !== b.length) {
      return false;
    }
    let status = a.localeCompare(b) >= 0;
    return status;
  };
  async get_symptom_now_day(disease_id: number) {
    let date = this.get_date();
    let data = await this.chartSymptomRepo.findAll({
      where: { disease_id, date: date.day },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'disease_id',
          'date',
          'chart_symptom_id',
        ],
      },
    });
    let promises = [];
    data.forEach(element => {
      promises.push(this.find_symptom(element));
    });
    let result = await Promise.all(promises);
    return { date: date.day, data: result };
  }
  private async find_symptom(data: any) {
    let symptom_data = await this.symptomRepo.findOne({
      where: { symptom_id: data.symptom_id },
      raw: true,
    });
    delete data.symptom_id;
    let tmp = this.sting2json(symptom_data.name);
    let name = this.setnameforloop(tmp);
    data['name'] = name;
    return data;
  }
  private setnameforloop(arr: any) {
    let name = '';
    arr.forEach(element => {
      name += ' ' + element;
    });
    return name;
  }
  async get_product_now_day(disease_id: number) {
    let date = this.get_date();
    let data = await this.chartProductRepo.findAll({
      where: { date: date.day, disease_id },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'date',
          'chart_product_id',
        ],
      },
    });
    let promises = [];
    data.forEach(element => {
      promises.push(this.find_product(element));
    });
    let result = await Promise.all(promises);
    var sum = result.reduce(
      function(a, b) {
        return { price: a.price + b.price };
      },
      { price: 0 },
    );
    return { date: date.day, data: result, total: sum.price };
  }
  private async find_product(data: any) {
    let product_data = await this.productRepo.findOne({
      where: { product_id: data.product_id },
      raw: true,
    });
    delete data.product_id;
    data['name'] = product_data.name;
    data['price'] = product_data.price * data.count;
    return data;
  }
  async get_user_now_day() {
    let date = this.get_date();
    let data = await this.chartUserRepo.findOne({
      where: { date: date.day },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'chart_user_id',
          'date',
        ],
      },
    });
    if (data == null) {
      return { date: date.day, data: [] };
    } else {
      return { date: date.day, data };
    }
  }
  async get_order_now_day() {
    let date = this.get_date();
    let data = await this.chartOrderRepo.findOne({
      where: { date: date.day },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'chart_order_id',
          'date',
        ],
      },
    });
    if (data == null) {
      return { date: date.day, data: [] };
    } else {
      return { date: date.day, data };
    }
  }
  async get_general_now_day(disease_id: number) {
    let date = this.get_date();
    let data = await this.chartGeneralRepo.findOne({
      where: { disease_id, date: date.day },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'disease_id',
          'date',
          'chart_general_id',
        ],
      },
    });
    if (data == null) {
      return { date: date.day, data: [] };
    } else {
      return { date: date.day, data };
    }
  }
  async get_all_now_day(disease_id: number) {
    let date = this.get_date();
    let g = await this.get_general_now_day(disease_id);
    let o = await this.get_order_now_day();
    let p = await this.get_product_now_day(disease_id);
    let s = await this.get_symptom_now_day(disease_id);
    let u = await this.get_user_now_day();
    return {
      date: date.day,
      general: { data: g.data },
      order: { data: o.data },
      product: { data: p.data, total: p.total },
      symtom: { data: s.data },
      user: { data: u.data },
    };
  }
  async get_all_now_mouth(disease_id: number) {
    let date = this.get_date();
    let mouth = await this.getIDMouth(date.month);

    let g = await this.get_general_now_mouth(disease_id, mouth.chart_m_id);
    let o = await this.get_order_now_mouth(mouth.chart_m_id);
    let p = await this.get_product_now_mouth(mouth.chart_m_id, disease_id);
    let s = await this.get_symptom_now_mouth(disease_id, mouth.chart_m_id);
    let u = await this.get_user_now_mouth(mouth.chart_m_id);
    return {
      date: mouth.date,
      general: g.data,
      order: o,
      product: p[0].product.data,
      symtom: s[0].symptom.data,
      user: u,
    };
  }
  async get_symptom_now_mouth(disease_id: number, mouth: number) {
    let date = this.get_date();
    let data = await this.chartSymptomRepo.findAll({
      where: { disease_id, chart_m_id: mouth },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'disease_id',
          'chart_symptom_id',
        ],
      },
    });
    let promises = [];
    data.forEach(element => {
      promises.push(this.find_symptom(element));
    });
    let result = await Promise.all(promises);
    result = this.filterSymptom(result);
    return result;
  }

  private filterSymptom(data: any) {
    let groups = [
      (o, p) => {
        var date = o.date.slice(3),
          temp = p.find(q => q.date === date);
        if (!temp) p.push((temp = { date, symptom: { data: [] } }));
        return temp.symptom.data;
      },
      ({ date }, p) => {
        var temp = p.find(q => q.date === date);
        if (!temp) p.push((temp = { date, data: [] }));
        return temp.data;
      },
      ({ date, ...o }, p) => p.push(o),
    ];
    let result = data.reduce((r, o) => {
      groups.reduce((p, fn) => fn(o, p), r);
      return r;
    }, []);
    return result;
  }
  private filterProduct(data: any) {
    let groups = [
      (o, p) => {
        var date = o.date.slice(3),
          temp = p.find(q => q.date === date);
        if (!temp) p.push((temp = { date, product: { data: [] } }));
        return temp.product.data;
      },
      ({ date }, p) => {
        var temp = p.find(q => q.date === date);
        if (!temp) p.push((temp = { date, data: [], total: 0 }));
        return temp;
      },
      ({ date, ...o }, p) => {
        p.total += o.price;
        return p.data.push(o);
      },
    ];
    let result = data.reduce((r, o) => {
      groups.reduce((p, fn) => fn(o, p), r);
      return r;
    }, []);
    return result;
  }
  async get_product_now_mouth(mouth: number, disease_id: number) {
    let date = this.get_date();
    let data = await this.chartProductRepo.findAll({
      where: { chart_m_id: mouth, disease_id },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'chart_product_id',
        ],
      },
    });
    let promises = [];
    data.forEach(element => {
      promises.push(this.find_product(element));
    });
    let result = await Promise.all(promises);
    result = this.filterProduct(result);
    
    return result;
  }

  async get_order_now_mouth(mouth: number) {
    let date = this.get_date();
    let data = await this.chartOrderRepo.findAll({
      where: { chart_m_id: mouth },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'chart_order_id',
        ],
      },
    });
    if (data.length == 0) {
      return [];
    } else {
      return data;
    }
  }
  async get_general_now_mouth(disease_id: number, mouth: number) {
    let date = this.get_date();
    let data = await this.chartGeneralRepo.findAll({
      where: { disease_id, chart_m_id: mouth },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'disease_id',
          'chart_general_id',
        ],
      },
    });
    return { date: date.day, data };
  }
  async get_user_now_mouth(mouth: number) {
    let date = this.get_date();
    let data = await this.chartUserRepo.findAll({
      where: { chart_m_id: mouth },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'chart_user_id',
        ],
      },
    });
    return data;
  }
  async getIDMouth(date) {
    let mouth = await this.chartMonthRepo.findOne({
      where: { date },
      raw: true,
    });
    return mouth;
  }
  async mock(chart_m_id, date, product, products) {
    product.forEach(async element => {
      await this.chartSymptomRepo.create({
        symptom_id: element,
        date,
        chart_m_id,
        disease_id: 21,
        count: Math.floor(Math.random() * 100),
      });
    });
    products.forEach(async element => {
      await this.chartSymptomRepo.create({
        symptom_id: element,
        date,
        chart_m_id,
        disease_id: 1,
        count: Math.floor(Math.random() * 100),
      });
    });
  }
  async get_user_now_year() {
    let date = this.get_date();
    let allmouth = await this.findMouthLate(date.month);
    let promises = [];
    allmouth.forEach(element => {
      promises.push(this.getDetailYearUser(element));
    });
    let result = await Promise.all(promises);
    return { data: result };
  }
  private async getDetailYearUser(date: any) {
    let data = await this.chartUserRepo.findAll({
      where: { chart_m_id: date.chart_m_id },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'chart_user_id',
        ],
      },
    });

    let count = 0;
    data = data.map(v => {
      count += v.count;
    });
    return { date: date.date, count };
  }
  async get_order_now_year() {
    let date = this.get_date();
    let allmouth = await this.findMouthLate(date.month);
    let promises = [];
    allmouth.forEach(element => {
      promises.push(this.getDetailYearOrder(element));
    });
    let result = await Promise.all(promises);
    return { data: result };
  }
  private async getDetailYearOrder(date: any) {
    let data = await this.chartOrderRepo.findAll({
      where: { chart_m_id: date.chart_m_id },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'chart_user_id',
        ],
      },
    });

    let count = 0;
    data = data.map(v => {
      count += v.count;
    });
    return { date: date.date, count };
  }
  async get_general_now_year(disease_id: number) {
    let date = this.get_date();
    let allmouth = await this.findMouthLate(date.month);
    let promises = [];
    allmouth.forEach(element => {
      promises.push(this.getDetailYearGeneral(element, disease_id));
    });
    let result = await Promise.all(promises);
    return { data: result };
  }
  private async getDetailYearGeneral(date: any, disease_id: number) {
    let data = await this.chartGeneralRepo.findAll({
      where: { disease_id, chart_m_id: date.chart_m_id },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'disease_id',
          'chart_general_id',
        ],
      },
    });

    let male = 0,
      female = 0,
      child = 0,
      adult = 0,
      elderly = 0;
    data = data.map(v => {
      male += v.male;
      female += v.female;
      child += v.child;
      adult += v.adult;
      elderly += v.elderly;
    });
    return { date: date.date, male, female, child, adult, elderly };
  }

  private async findMouthLate(now: any) {
    let arr = [];
    let m = now.split('/')[0];
    let y = now.split('/')[1];
    m++;
    y--;
    for (let index = 0; index < 12; index++) {
      if (m == 1) {
        y++;
      }
      if (m < 10) {
        m = '0' + m;
      }
      let mouth = await this.chartMonthRepo.findOne({
        where: { date: m + '/' + y },
        raw: true,
      });
      arr.push({ date: m + '/' + y, chart_m_id: mouth.chart_m_id });
      m = (m % 12) + 1;
    }

    return arr;
  }
  async get_product_now_year(disease_id: number) {
    let date = this.get_date();
    let allmouth = await this.findMouthLate(date.month);
    let promises = [];
    allmouth.forEach(element => {
      promises.push(this.getDetailYearProduct(element, disease_id));
    });

    let result = await Promise.all(promises);
    return { data: result };
  }
  private async getDetailYearProduct(date: any, disease_id: number) {
    let data = await this.chartProductRepo.findAll({
      where: { chart_m_id: date.chart_m_id, disease_id },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'chart_product_id',
        ],
      },
    });
    let promises = [];
    data.forEach(element => {
      promises.push(this.find_product(element));
    });
    let result = await Promise.all(promises);
    return this.filterProductYear(result);
  }
  private filterProductYear(data: any) {
    let groups = [
      (o, p) => {
        var date = o.date.slice(3),
          temp = p.find(q => q.date === date);
        if (!temp) p.push((temp = { date, data: [], total: 0 }));
        return temp;
      },
      ({ date, ...o }, p) => {
        var index = p.data.findIndex(q => q.name === o.name);
        if (index == -1) {
          p.total += o.price;
          p.data.push(o);
        } else {
          p.data[index].price += o.price;
          p.data[index].count += o.count;
          p.total += o.price;
        }

        return p;
      },
    ];
    let result = data.reduce((r, o) => {
      groups.reduce((p, fn) => fn(o, p), r);
      return r;
    }, []);
    return result[0];
  }
  async get_symptom_now_year(disease_id: number) {
    let date = this.get_date();
    let allmouth = await this.findMouthLate(date.month);
    let promises = [];
    allmouth.forEach(element => {
      promises.push(this.getDetailYearSymptom(element, disease_id));
    });

    let result = await Promise.all(promises);
    return { data: result };
  }
  private async getDetailYearSymptom(date: any, disease_id: number) {
    let data = await this.chartSymptomRepo.findAll({
      where: { disease_id, chart_m_id: date.chart_m_id },
      raw: true,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'chart_m_id',
          'disease_id',
          'chart_symptom_id',
        ],
      },
    });
    let promises = [];
    data.forEach(element => {
      promises.push(this.find_symptom(element));
    });
    let result = await Promise.all(promises);
    return this.filterSymptomYear(result);
  }
  private filterSymptomYear(data: any) {
    let groups = [
      (o, p) => {
        var date = o.date.slice(3),
          temp = p.find(q => q.date === date);
        if (!temp) p.push((temp = { date, data: [] }));
        return temp;
      },
      ({ date, ...o }, p) => {
        var index = p.data.findIndex(q => q.name === o.name);
        if (index == -1) {
          p.data.push(o);
        } else {
          p.data[index].count += o.count;
        }

        return p;
      },
    ];
    let result = data.reduce((r, o) => {
      groups.reduce((p, fn) => fn(o, p), r);
      return r;
    }, []);
    return result[0];
  }
  async get_all_now_year(disease_id: number) {
    let g = await this.get_general_now_year(disease_id);
    let o = await this.get_order_now_year();
    let p = await this.get_product_now_year(disease_id);
    let s = await this.get_symptom_now_year(disease_id);
    let u = await this.get_user_now_year();
    return {
      general: g.data,
      order: o.data,
      product: p.data,
      symtom: s.data,
      user: u.data,
    };
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
  async delete_sub_data_chart(type: number, id: number){
    switch (type) {
      case 1:
        await this.product_delete(id);
        break;
      case 2:
        await this.symptom_delete(id);
        break;
      case 3:
        await this.general_delete(id);
        break;
      default:
        break;
    }
  }
  private  async product_delete(product_id : number){
    await this.chartProductRepo.destroy({where:{product_id}})
  }
  private  async symptom_delete(symptom_id : number){
    await this.chartSymptomRepo.destroy({where:{symptom_id}})
  }
  private  async general_delete(disease_id : number){
    await this.chartGeneralRepo.destroy({where:{disease_id}})
  }
  async create_null_chart_data(type: number, data: any) {
    let date = this.get_date();
    let year = await this.create_year(date.year);
    let chart_y_id = year.chart_y_id;
    let month = await this.create_month(date.month, chart_y_id);
    let chart_m_id = month.chart_m_id;
    switch (type) {
      case 1:
        await this.product_create(date.day, chart_m_id, data);
        break;
      case 2:
        await this.symptom_create(date.day, chart_m_id, data);
        break;
      case 3:
        await this.general_create(date.day, chart_m_id, data);
        break;
      default:
        break;
    }
  }
  private async product_create(
    date: string,
    chart_m_id: number,
    data : any
  ) {
    let res = await this.chartProductRepo.findOne({
      where: { date, chart_m_id, product_id:data.product_id,disease_id:data.disease_id },
      raw: true,
    });
    if (!res) {
      await this.chartProductRepo.create({
        date,
        count: 0,
        chart_m_id,
        product_id:data.product_id,
        disease_id:data.disease_id
      });
    }
  }
  private async symptom_create(
    date: string,
    chart_m_id: number,
    data: any,
  ) {
    let res = await this.chartSymptomRepo.findOne({
      where: {
        date,
        chart_m_id,
        symptom_id: data.symptom_id,
        disease_id: data.disease_id,
      },
      raw: true,
    });
    if (!res) {
      await this.chartSymptomRepo.create({
        date,
        count: 0,
        chart_m_id,
        symptom_id: data.symptom_id,
        disease_id: data.disease_id,
      });
    }
  }
  private async general_create(
    date: string,
    chart_m_id: number,
    data: any,
  ) {
    let res = await this.chartGeneralRepo.findOne({
      where: {
        date,
        chart_m_id,
        disease_id: data.disease_id,
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
        disease_id: data.disease_id,
      });
    }
  }
}

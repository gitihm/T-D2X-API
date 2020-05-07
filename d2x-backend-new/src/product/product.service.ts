import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../product/model/product.model';
import { ChartService } from '../chart/chart.service';
var tmp;
@Injectable()
export class ProductService {
  constructor(
    @Inject('productRepo') private readonly product: typeof Product,
    private readonly chartService: ChartService,
  ) {}
  async get_product(id: number) {
    return await this.product.findOne({ where: { product_id: id }, raw: true });
  }
  async get_products() {
    return await this.product.findAll({ raw: true });
  }
  async create_products(product: Product) {
    let product_create = JSON.parse(
      JSON.stringify(await this.product.create(product), null, 4),
    );
    await this.chartService.create_null_chart_data(1, {
      product_id: product_create.product_id,
      disease_id: product_create.disease_id,
    });
    return product_create;
  }
  async update_product(product_id: any, product: Product) {
    const data = await this.product.findByPk(product_id);
    if (data) {
      return await data.update(product);
    }
    return null;
  }
  async delete_product(product_id: any) {
    const data = await this.product.findByPk(product_id);
    if (data) {
      await this.chartService.delete_sub_data_chart(1, product_id);

      return await data.destroy();
    }
    return null;
  }
}

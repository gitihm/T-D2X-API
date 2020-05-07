import { Injectable, Inject,forwardRef } from '@nestjs/common';
import { Views } from './model/views.model';
@Injectable()
export class ViewsService {
  constructor(
    @Inject('viewsRepo') private readonly viewsRepo: typeof Views,
  ) {
    
  }
  async get_count(ip_client:string){
    let ips = await this.viewsRepo.findOne({where: {ip: ip_client},raw:true})
    if(!ips)
        await this.viewsRepo.create({ip:ip_client})
    return await this.viewsRepo.findAndCountAll({raw:true})
  }
 
}
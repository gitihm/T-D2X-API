import { Injectable, Inject } from '@nestjs/common';
import { DiseaseHeader } from './model/disease.model';
import { MESSAGE } from '../config/message/global.configure';
import { QuestionTest } from '../question/model/questiontest.model';
import { ChartService } from '../chart/chart.service';
import { From } from 'src/symptom/model/symptom.model';
@Injectable()
export class DiseaseService {
  constructor(
    @Inject('diseaseheaderRepo')
    private readonly diseaseheaderRepo: typeof DiseaseHeader,
    @Inject('questionTestRepo')
    private readonly questionTestRepo: typeof QuestionTest,
    private readonly chartService: ChartService,
    @Inject('fromRepo') private readonly fromRepo: typeof From,
  ) {
    this.diseaseheaderRepo.addScope('raw', {
      raw: true,
    });
    this.diseaseheaderRepo.addScope('question', {
      include: [{ model: questionTestRepo, separate: true, as: 'questions' }],
    });
  }

  async create_disease(disease: any) {
    let header = JSON.parse(
      JSON.stringify(await this.diseaseheaderRepo.create(disease), null, 4),
    );
    await this.chartService.create_null_chart_data(3, {
      disease_id: header.disease_id,
    });
    return header;
  }
  async get_disease(options: any) {
    return await this.diseaseheaderRepo.scope(options).findAll();
  }
  async delete_disease(disease_id: number) {
    await this.chartService.delete_sub_data_chart(3, disease_id);
    await this.dalete_formData(disease_id)
    let status = await this.diseaseheaderRepo.destroy({
      where: { disease_id },
    });

    return status ? MESSAGE.DELETE_SUCCEED : MESSAGE.DELETE_FAILED;
  }
  async dalete_formData(disease_id: number) {
    await this.fromRepo.destroy({
      where: { disease_id },
    });
  }
  async update_disease(disease_id: number, name: string, status: number) {
    let status_update = await this.diseaseheaderRepo.update(
      { name, status },
      { where: { disease_id } },
    );
    return status_update[0] ? MESSAGE.UPDATE_SUCCEED : MESSAGE.UPDATE_FAILED;
  }
}

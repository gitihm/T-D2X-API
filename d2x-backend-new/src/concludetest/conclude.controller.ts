import { 
    Controller, 
    Get,
    HttpStatus,
    Res,
    Post,
    Body,
    Delete,
    Param,
    Patch,
   } from '@nestjs/common';
  import { ConcludeService } from './conclude.service';
  @Controller('conclude')
  export class ConcludeController {
    constructor(private readonly concludeService: ConcludeService) {}
    
    @Post()
    async findSymptom(@Body('disease_id') disease_id ,@Body('choice') choice , @Res() res){
        let status = HttpStatus.OK;
        let response = await this.concludeService.findSymptom(choice,disease_id);
        return res.status(status).json(response);
    }
    
  }
import { HttpException, HttpStatus } from '@nestjs/common';

export class ResponseDto<T> {
    constructor(readonly message: string, readonly data: T) {}

    static OK(): ResponseDto<string> {
        return new ResponseDto<string>('OK', '');
    }

    static OK_WITH<T>(data: T): ResponseDto<T> {
        return new ResponseDto<T>('', data);
    }

    static ERROR() {
        return new HttpException(new ResponseDto('', ''), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    static ERROR_WITH(message: string, code: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
        return new HttpException(message, code);
    }

    static ERROR_WITH_DATA<T>(message: string, code: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR, data: T) {
        return new HttpException(new ResponseDto<T>(message, data), code);
    }

    // toObject(): Record<string, any> {
    //     return {
    //         message: this.message,
    //         data: this.data,
    //     };
    // }
}

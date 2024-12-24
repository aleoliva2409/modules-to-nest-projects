import { HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';

export const errorManager = (error: unknown) => {
  if (error instanceof HttpException) {
    throw new HttpException(
      {
        message: error.message,
        code: error.getStatus(),
        error: error.getResponse()['error'],
      },
      error.getStatus(),
    );
  }

  throw new InternalServerErrorException({
    message: 'Check logs for more details',
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    error: 'Internal Server Error',
  });
};

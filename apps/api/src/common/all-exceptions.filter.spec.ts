import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

function mockHost(url: string) {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ url }),
    }),
  } as unknown as ArgumentsHost;
  return { host, status, json };
}

describe('AllExceptionsFilter', () => {
  it('maps an HttpException to the error envelope', () => {
    const filter = new AllExceptionsFilter();
    const { host, status, json } = mockHost('/api/test');
    filter.catch(new HttpException('boom', HttpStatus.BAD_REQUEST), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'boom', path: '/api/test' }),
    );
  });

  it('maps an unknown error to a 500 envelope', () => {
    const filter = new AllExceptionsFilter();
    const { host, status, json } = mockHost('/api/test');
    filter.catch(new Error('unexpected'), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500 }));
  });
});

import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../errors/custom-error'
/*
  Error format:
  {
    errors:{
      message: string,
      field?: string,
    }[]
  }
*/
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    console.log('ÝYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
    console.log('ÝYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
    console.log('ÝYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
    console.log('ÝYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
    console.log('ÝYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
    console.log('ÝYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
    console.log('ÝYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
    console.log('ÝYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
    console.log('ÝYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
    console.log('ÝYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
    return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  } else {
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
  }

  console.log(err)

  res.status(400).send({
    errors: [{ message: 'Something went wrong' }],
  })
}

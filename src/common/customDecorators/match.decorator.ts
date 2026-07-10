import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

//Custom validation classes
@ValidatorConstraint({ name: 'customText', async: false })
export class MatchBetweenFields implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {

    return value == args.object['password']
  }

  defaultMessage(args: ValidationArguments):string {
    
    return 'fail to match between password!';
  }
}



//Custom validation decorators
export function isMatch(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: MatchBetweenFields,
    });
  };
}



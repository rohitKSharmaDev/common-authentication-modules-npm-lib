import * as Validator from "yup";

const urlTemplateRegex = /^(https?):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)?[a-z\d]{2,256}|localhost)(\.[a-z]{2,6})+(\/([-a-z\d%_~+]|(\{[a-z_]+\}))*)*(\.[a-z]+)?(\?([;&a-z\d%_~+-]*(=([;a-z\d%_~+-]*|\{[a-z_]+\})*)?)*)?(\#[-a-z\d_]*)?$/i;

Validator.addMethod(Validator.StringSchema, 'onlyAlphaNumericSpaceAllowed', function(message = "Only alphabet(s), number(s) and space(s) are allowed") {
  return this.test('onlyAlphaNumericSpaceAllowed', message, (value) => {
    
    if(!value) return true;

    return /^[a-zA-Z0-9 ]*$/.test(value);
  });
});

Validator.addMethod(Validator.StringSchema, 'onlyAlphaNumSpecCharAllowed', function(message = "Only alphabet(s), number(s), space(s), comma(s), hyphen(s) and underscore(s) are allowed") {
  return this.test('onlyAlphaNumSpecCharAllowed', message, (value) => {
    
    if(!value) return true;
    
    return /^[a-zA-Z0-9 _,-.()&]*$/.test(value);
  });
});


Validator.addMethod(Validator.StringSchema, 'onlyAlphaSpaceAllowed', function(message = "Only alphabet(s) and space(s) are allowed") {
  return this.test('onlyAlphaSpaceAllowed', message, (value) => {
    
    if(!value) return true;

    return /^[a-zA-Z0-9 ]*$/.test(value);
  });
});

Validator.addMethod(Validator.StringSchema, 'onlySpaceNotAllowed', function(message = "Only space(s) are not allowed") {
  return this.test('onlySpaceNotAllowed', message, (value) => {
    
    if(!value) return true;

    return !(/^[ ]+$/.test(value));
  });
});

Validator.addMethod(Validator.StringSchema, 'urlTemplate', function(message = "Invalid URL template") {
  return this.test('urlTemplate', message, (value) => {
    
    if(!value) return true;

    return (urlTemplateRegex.test(value));
  });
});

Validator.addMethod(Validator.StringSchema, 'password', function(message = "Invalid Password") {
  return this.test('password', message, (value) => {
    
    if(!value) return true;

    return (/^[A-Za-z\d@$#!%*?&]+$/.test(value));
  });
});

Validator.addMethod(Validator.StringSchema, 'strongPassword', function(message = "At least one character required of (A-Z), (a-z), (0-9) and a special character.") {
  return this.test('strongPassword', message, (value) => {
    
    if(!value) return true;

    return (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]+$/.test(value));
  });
});

Validator.addMethod(Validator.StringSchema, 'noLeadingOrTrailingSpace', function(message = "Leading or Trailing space(s) not allowed") {
  return this.test('noLeadingOrTrailingSpace', message, (value) => {
    if (!value) return true;  

    const trimmedValue = value.trim();  
    return value === trimmedValue;  
  });
});

Validator.addMethod(Validator.StringSchema, 'databEmail', function (message = "Enter valid email id") {
  return this.test('databEmail', message, (value) => {
    if (!value) return true;

    return (/^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(value)) && !/\.\./.test(value);
  });
});

Validator.addMethod(Validator.StringSchema, 'ymUrl', function (message = "Enter valid email id") {
  return this.test('ymUrl', message, (value) => {
    if (!value) return true;

    return (/^(https?:\/\/)([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,})(:[0-9]{1,5})?(\/[^\s]*)?$/.test(value));
  });
});

Validator.addMethod(Validator.StringSchema, 'ymUrlHttpsOnly', function (message = "Enter valid email id") {
  return this.test('ymUrlHttpsOnly', message, (value) => {
    if (!value) return true;

    return (/^https:\/\/([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,})(:[0-9]{1,5})?(\/[^\s]*)?$/.test(value));
  });
});

Validator.addMethod(Validator.StringSchema, 'ymPhnNumber', function (message = "Enter valid email id") {
  return this.test('ymPhnNumber', message, (value) => {
    if (!value) return true;

    return (/^[0-9]+$/.test(value));
  });
});

export default Validator;
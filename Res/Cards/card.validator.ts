import Joi from 'joi'


export class CardValidator {
    public async ValidateCardCreation(data: any) {
        const schema = Joi.object({
            cvv: Joi.string().required(),
            exp: Joi.string().required(),
            name: Joi.string().required(),
            cardNo: Joi.string().required(),
        });
        return schema.validate(data);
    }
}
import Joi from 'joi'

export class ProfileValidator {
    public async validateProfileEdit(data: any) {
        const schema = Joi.object({
            address: Joi.string().required(),
            phone: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            zip: Joi.string().required(),
            country: Joi.string().required(),
        });
        return schema.validate(data);
    }

    public async validateNotificationStatus(data: any) {
        const schema = Joi.object({
            desktop: Joi.boolean().required(),
            mobile: Joi.boolean().required(),
            email: Joi.boolean().required(),
            login: Joi.boolean().required(),
        });
        return schema.validate(data);
    }

    public async validateSecurityStatus(data: any) {
        const schema = Joi.object({
            fa: Joi.boolean().required(),
            mobile: Joi.boolean().required(),
            email: Joi.boolean().required(),
        })
        return schema.validate(data)
    }
}
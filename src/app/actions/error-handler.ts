import CustomError from '../../lib/custom-error'
import { ZodError } from 'zod'

export default function errorHandler<argument, result>(action: (arg: argument) => Promise<result>) {
    return async function (
        arg: argument
    ): Promise<{ success: true; result: result } | { success: false; message: string }> {
        try {
            const result = await action(arg)

            return {
                success: true,
                result,
            }
        } catch (error) {
            if (error instanceof CustomError) {
                return {
                    success: false,
                    message: error.message,
                }
            }

            if (error instanceof ZodError) {
                let message = ''

                for (const err of error.errors) {
                    message += err.message + '. '
                }

                return {
                    success: false,
                    message: message.trimEnd(),
                }
            }

            console.error(error)

            return { success: false, message: 'Something went wrong.' }
        }
    }
}

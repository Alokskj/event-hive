import { ErrorResponder } from '../../interfaces/responder.interfaces';
import { DevelopmentErrorResponder } from '../development-error-responder';
import { ProductionErrorResponder } from '../production-error-responder';
import _config from '../../../../config/_config';

/**
 * Factory for creating appropriate error responders based on environment
 */
export class ErrorResponderFactory {
    private static developmentResponder = new DevelopmentErrorResponder();
    private static productionResponder = new ProductionErrorResponder();

    /**
     * Get the appropriate error responder based on environment
     */
    static getResponder(): ErrorResponder {
        return _config.env === 'development'
            ? this.developmentResponder
            : this.productionResponder;
    }
}

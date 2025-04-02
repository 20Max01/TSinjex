import {
    test_injectFunction,
    test_RegisterFunction,
    test_ResolveFunction,
} from './Functions.spec.js';
import { TSinjex } from '../classes/TSinjex.js';
import { inject } from '../functions/inject.js';
import { register } from '../functions/register.js';
import { resolve } from '../functions/resolve.js';

test_RegisterFunction(TSinjex, register);
test_ResolveFunction(TSinjex, resolve);

import { TSinjex } from 'src/classes/TSinjex.js';
import { register } from 'src/functions/register.js';
import { resolve } from 'src/functions/resolve.js';
import {
    test_RegisterFunction,
    test_ResolveFunction,
} from './Functions.spec.js';

test_RegisterFunction(TSinjex, register);
test_ResolveFunction(TSinjex, resolve);

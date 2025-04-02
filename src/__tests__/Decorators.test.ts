/* eslint-disable deprecation/deprecation */
import { TSinjex } from 'src/classes/TSinjex.js';
import { Inject } from 'src/decorators/Inject.js';
import { Register } from 'src/decorators/Register.js';
import { RegisterInstance } from 'src/decorators/RegisterInstance.js';
import {
    test_InjectDecorator,
    test_RegisterDecorator,
    test_RegisterInstanceDecorator,
} from './Decorators.spec.js';

test_InjectDecorator(TSinjex, Inject);

test_RegisterDecorator(TSinjex, Register);

test_RegisterInstanceDecorator(TSinjex, RegisterInstance);

test_RegisterInstanceDecorator(TSinjex, Register, 'instance');

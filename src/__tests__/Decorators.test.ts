/* eslint-disable deprecation/deprecation */
import { TSinjex } from 'src/classes/TSinjex';
import { Inject } from 'src/decorators/Inject';
import { Register } from 'src/decorators/Register';
import { RegisterInstance } from 'src/decorators/RegisterInstance';
import {
    test_InjectDecorator,
    test_RegisterDecorator,
    test_RegisterInstanceDecorator,
} from './Decorators.spec';

test_InjectDecorator(TSinjex, Inject);

test_RegisterDecorator(TSinjex, Register);

test_RegisterInstanceDecorator(TSinjex, RegisterInstance);

test_RegisterInstanceDecorator(TSinjex, Register, 'instance');

import { ValidationError } from 'validator';
import dbMock from '../../test/dbMock';

import userModel from './user';

const validUser = {
  name: 'test-name',
  github: 'test-github',
  email: 'test@test.com',
};

const minimalValidUser = {
  github: 'test',
  email: 'test@test.com',
};

const invalidUserEmail = {
  github: 'test',
  email: 'testing',
};

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbMock.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbMock.clearDatabase());

/**
 * Remove and close the db and server after running all tests.
 */
afterAll(async () => await dbMock.closeDatabase());

describe('User Model Test', () => {
  it('can create and save user', async () => {
    const validUserModel = new userModel(validUser);
    const mongooseSavedUser = await validUserModel.save();
    const savedUser = mongooseSavedUser.toObject();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(validUser.name);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.github).toBe(validUser.github);
    expect(savedUser.membership.active).toBe(false);
    expect(savedUser.membership.date_joined).toBeDefined();
    expect(savedUser.membership.years).toMatchObject([]);
  });

  it('can create and save user with only github and email details', async () => {
    const validUserModel = new userModel(minimalValidUser);
    const mongooseSavedUser = await validUserModel.save();
    const savedUser = mongooseSavedUser.toObject();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(null);
    expect(savedUser.email).toBe(minimalValidUser.email);
    expect(savedUser.github).toBe(minimalValidUser.github);
    expect(savedUser.membership.active).toBe(false);
    expect(savedUser.membership.date_joined).toBeDefined();
    expect(savedUser.membership.years).toMatchObject([]);
  });

  it('can activate a user', async () => {
    const validUserModel = new userModel(validUser);
    const mongooseSavedUser = await validUserModel.save();
    // Check membership beforehand
    const savedUser = mongooseSavedUser.toObject();
    expect(savedUser.membership.active).toBe(false);
    expect(savedUser.membership.date_joined).toBeDefined();
    expect(savedUser.membership.years).toMatchObject([]);

    // Activate membership
    mongooseSavedUser.activateMembership();
    const activatedSavedUser = mongooseSavedUser.toObject();
    const currentYear = new Date().getFullYear();
    expect(activatedSavedUser.membership.active).toBe(true);
    expect(activatedSavedUser.membership.date_joined).toBeDefined();
    expect(activatedSavedUser.membership.years).toMatchObject([currentYear]);
  });

  it('can activate then deactivate a user', async () => {
    const validUserModel = new userModel(validUser);
    const mongooseSavedUser = await validUserModel.save();
    // Activate membership
    mongooseSavedUser.activateMembership();
    const activatedSavedUser = mongooseSavedUser.toObject();
    expect(activatedSavedUser.membership.active).toBe(true);

    // Deactivate membership
    mongooseSavedUser.resetMembership();
    const deactivatedSavedUser = mongooseSavedUser.toObject();
    expect(deactivatedSavedUser.membership.active).toBe(false);
  });

  it('can calculate number of years active', async () => {
    const validUserModel = new userModel(validUser);
    const mongooseSavedUser = await validUserModel.save();
    expect(mongooseSavedUser.yearsActive()).toBe(0);

    mongooseSavedUser.activateMembership();
    expect(mongooseSavedUser.yearsActive()).toBe(1);
  });

  it('can detect an invalid email', async () => {
    const invalidUserEmailModel = new userModel(invalidUserEmail);
    expect(invalidUserEmailModel.save()).rejects.toThrowError(ValidationError);
  });
});

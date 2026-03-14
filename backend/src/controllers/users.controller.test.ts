import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDto, UserDto } from '../validations/user';
import { EmailExistsException } from '../exceptions/user.exceptions';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

// Mocking UsersService
const mockUsersService = {
  create: vi.fn(),
};

// Helper function to create a valid CreateUserDto
const createValidUserDto = (): CreateUserDto => ({
  email: 'test@example.com',
  password: 'securePassword123',
});

// Helper function to create a valid UserDto
const createValidUserResponse = (): UserDto => ({
  id: '1',
  email: 'test@example.com',
});

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(() => {
    usersController = new UsersController(mockUsersService as any);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const dto = createValidUserDto();
      const expectedResponse = createValidUserResponse();

      mockUsersService.create.mockResolvedValue(expectedResponse);

      const result = await usersController.createUser(dto);

      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });

    it('should throw ConflictException if email already exists', async () => {
      const dto = createValidUserDto();

      mockUsersService.create.mockRejectedValue(new EmailExistsException('Email already exists'));

      await expect(usersController.createUser(dto)).rejects.toThrow(ConflictException);
      await expect(usersController.createUser(dto)).rejects.toThrow('Email already exists');
    });

    it('should throw InternalServerErrorException for unexpected errors', async () => {
      const dto = createValidUserDto();

      mockUsersService.create.mockRejectedValue(new Error('Unexpected error'));

      await expect(usersController.createUser(dto)).rejects.toThrow(InternalServerErrorException);
      await expect(usersController.createUser(dto)).rejects.toThrow('an unexpected error occurred while creating a user');
    });
  });
});

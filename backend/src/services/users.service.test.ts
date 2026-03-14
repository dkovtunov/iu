import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersService } from './users.service';
import { UserRepository } from '../repositories/user.repository';
import { CryptoRepository } from '../repositories/crypto.repository';
import { Queue } from 'bullmq';
import { MockKafkaClient } from '../messaging/mock.kafka.client';
import { CreateUserDto } from '../validations/user';
import { EmailExistsException } from '../exceptions/user.exceptions';

// Mock dependencies
const mockUserRepository = {
  getByEmail: vi.fn(),
  create: vi.fn(),
};

const mockCryptoRepository = {};

const mockGreetingEmailQueue = {
  add: vi.fn(),
};

const mockKafkaClient = {
  emit: vi.fn(),
};

// Test suite for UsersService
describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService(
      mockUserRepository as unknown as UserRepository,
      mockCryptoRepository as unknown as CryptoRepository,
      mockGreetingEmailQueue as unknown as Queue,
      mockKafkaClient as unknown as MockKafkaClient
    );
  });

  describe('create', () => {
    it('should create a new user and return UserDto', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const createdUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      };

      mockUserRepository.getByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await usersService.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockGreetingEmailQueue.add).toHaveBeenCalledWith('welcome', { id: '1' });
      expect(mockKafkaClient.emit).toHaveBeenCalledWith('user.created', createdUser);
    });

    it('should throw EmailExistsException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const existingUser = {
        id: '1',
        name: 'Existing User',
        email: 'test@example.com',
      };

      mockUserRepository.getByEmail.mockResolvedValue(existingUser);

      await expect(usersService.create(createUserDto)).rejects.toThrow(EmailExistsException);
      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockGreetingEmailQueue.add).not.toHaveBeenCalled();
      expect(mockKafkaClient.emit).not.toHaveBeenCalled();
    });
  });
});

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Eventos.Application.Contratos;
using Eventos.Application.Dtos;
using Eventos.Domain.Identity;
using Eventos.Persistence.Contratos;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Eventos.Application
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;
        private readonly IUserPersist _userPersist;
        public AccountService(UserManager<User> userManager, SignInManager<User> signInManager, IMapper mapper, IUserPersist userPersist)
        {
            _userPersist = userPersist;
            _mapper = mapper;
            _signInManager = signInManager;
            _userManager = userManager;
            
        }
        public async Task<SignInResult> CheckUserPasswordAsync(UserUpdateDto userUpdateDto, string password)
        {
            try
            {
                var user = await _userManager.Users.SingleOrDefaultAsync(user => user.UserName == userUpdateDto.UserName.ToLower());

                return await _signInManager.CheckPasswordSignInAsync(user, password, false);
            }
            catch (System.Exception ex)
            {
                
                throw new Exception($"Erro ao tentar verificar password. Erro: {ex.Message}");
            }
        }

        public async Task<UserUpdateDto> CreateAccountAsync(UserDto userDto)
        {
            try
            {
                var user = _mapper.Map<User>(userDto);
                var result = await _userManager.CreateAsync(user, userDto.Password);

                if(result.Succeeded)
                {
                    var userToReturn = _mapper.Map<UserUpdateDto>(user);
                    return userToReturn;
                }

                return null;
            }
            catch (System.Exception ex)
            {
                
                throw new Exception($"Erro ao tentar criar conta. Erro: {ex.Message}");
            }
        }

        public async Task<UserUpdateDto> GetUserByUserNameAsync(string username)
        {
            try
            {
                var user = await _userPersist.GetUserByUserNameAsync(username);
                if(user == null) return null;

                var userUpdateDto = _mapper.Map<UserUpdateDto>(user);

                return userUpdateDto;
            }
            catch (System.Exception ex)
            {
                
                throw new Exception($"Erro ao tentar pegar usuário. Erro: {ex.Message}");
            }
        }

        public async Task<UserUpdateDto> UpdateAccount(UserUpdateDto userUpdateDto)
        {
            try
            {
                var user = await _userPersist.GetUserByUserNameAsync(userUpdateDto.UserName);
                if(user == null) return null;

                userUpdateDto.Id = user.Id;

                _mapper.Map(userUpdateDto, user);

                if(userUpdateDto.Password != null){
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    await _userManager.ResetPasswordAsync(user, token, userUpdateDto.Password);
                }

                _userPersist.Update<User>(user);

                if(await _userPersist.SaveChangesAsync())
                {
                    var userRetorno = await _userPersist.GetUserByUserNameAsync(user.UserName);

                    return _mapper.Map<UserUpdateDto>(userRetorno);
                }
                
                return null;
            }
            catch (System.Exception ex)
            {
                
                throw new Exception($"Erro ao tentar atualizar usuário. Erro: {ex.Message}");
            }
        }

        public async Task<bool> UserExists(string username)
        {
            try
            {
                return await _userManager.Users.AnyAsync(user => user.UserName == username.ToLower());
            }
            catch (System.Exception ex)
            {
                
                throw new Exception($"Erro ao tentar verificar se usuário existe. Erro: {ex.Message}");
            }
        }
    }
}
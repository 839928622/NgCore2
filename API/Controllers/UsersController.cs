﻿using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs.Member;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UsersController: BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly MapsterMapper.IMapper _mapster;


        public UsersController(IUserRepository userRepository, IMapper mapper, MapsterMapper.IMapper mapster)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _mapster = mapster;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberToReturnDto>>> GetUsers()
        {
            var users = await _userRepository.GetUserAsync();
            return Ok(_mapster.Map<IEnumerable<MemberToReturnDto>>(users));
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberToReturnDto>> GetUser(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);
            return _mapper.Map<MemberToReturnDto>(user);
        }
    }
}
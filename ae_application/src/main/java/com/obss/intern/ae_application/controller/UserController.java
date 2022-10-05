package com.obss.intern.ae_application.controller;

import com.obss.intern.ae_application.data.dto.UserPublicDetailsDto;
import com.obss.intern.ae_application.data.entity.sql.User;
import com.obss.intern.ae_application.data.mapper.UserMapper;
import com.obss.intern.ae_application.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    // Mail'e ait kullanıcı var mı diye sorgular, bulunamazsa 204 döndürür.
    @GetMapping("/getByEmail")
    public UserPublicDetailsDto getUserByMail(@RequestParam String email) {
        User user = userService.findUserByMail(email);
        if (user != null) {
            return userMapper.userToUserPublicDetailsDto(user);
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No user found by this e-mail!");
    }

    // Kullanıcının kendi bilgilerini döndürür.
    @GetMapping("/getByUsername")
    public UserPublicDetailsDto getUserByUsername(@RequestParam String username, Authentication authentication) {
        if (username.compareTo(((User) authentication.getDetails()).getUserName()) != 0) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "You can not query not other than by yourself!");
        }
        User user = userService.findUserByUsername(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);
        }
        return userMapper.userToUserPublicDetailsDto(user);
    }

    @GetMapping("/search")
    public List<UserPublicDetailsDto> searchTaskValue(@RequestParam String value, @RequestParam Long page) {
        List<User> users = userService.searchUser(value, page);
        return users.stream().map(userMapper::userToUserPublicDetailsDto).toList();
    }
}

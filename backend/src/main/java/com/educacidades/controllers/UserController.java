package com.educacidades.controllers;

import com.educacidades.models.user.User;
import com.educacidades.models.user.dto.UserCreateDTO;
import com.educacidades.models.user.dto.UserDTO;
import com.educacidades.models.user.dto.UserSummaryDTO;
import com.educacidades.models.user.dto.UserUpdateDTO;
import com.educacidades.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        User user = userCreateDTO.toEntity(User.class);
        User newUser = userService.create(user, userCreateDTO.profiles());

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newUser.getId()).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        User user = userUpdateDTO.toEntity(User.class);
        userService.update(id, user, userUpdateDTO.profiles());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> findAll() {
        List<User> users = userService.findAll(false);
        return ResponseEntity.ok().body(users.stream().map(User::toDTO).toList());
    }

    @GetMapping("/summary")
    public ResponseEntity<List<UserSummaryDTO>> findAllBasicList() {
        List<User> users = userService.findAll(true);
        return ResponseEntity.ok().body(users.stream().map(User::toSummaryDTO).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> findById(@PathVariable Long id) {
        User user = userService.findById(id, false);
        return ResponseEntity.ok().body(user.toDTO());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/disable/{id}")
    public ResponseEntity<Void> disable(@PathVariable Long id) {
        userService.disable(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/enable/{id}")
    public ResponseEntity<Void> enable(@PathVariable Long id) {
        userService.enable(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me() {
        User me = userService.me();
        return ResponseEntity.ok().body(me.toDTO());
    }

    @GetMapping("/my-tasks-count")
    public ResponseEntity<Integer> myTasksCount() {
        return ResponseEntity.ok().body(userService.myTasksCount());
    }
    
}
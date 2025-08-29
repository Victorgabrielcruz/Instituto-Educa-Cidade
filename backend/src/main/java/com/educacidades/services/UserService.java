package com.educacidades.services;

import com.educacidades.models.user.User;
import com.educacidades.models.user.enums.EStatus;
import com.educacidades.models.user.enums.ProfileEnum;
import com.educacidades.repositories.UserRepository;
import com.educacidades.repositories.TaskRepository;
import com.educacidades.security.UserSpringSecurity;
import com.educacidades.services.exceptions.AuthorizationException;
import com.educacidades.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static UserSpringSecurity authenticated() {
        try {
            return (UserSpringSecurity) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            return null;
        }
    }

    public static boolean isAdmin() {
        UserSpringSecurity userSpringSecurity = authenticated();
        return userSpringSecurity != null && userSpringSecurity.hasRole(ProfileEnum.ADMIN);
    }

    @Transactional
    public User me() {
        UserSpringSecurity me = authenticated();
        return this.findById(me.getId(), false);
    }

    @Transactional
    public List<User> findAllAdmins() {
        return userRepository.findUsersByProfiles(ProfileEnum.ADMIN.getCode());
    }

    @Transactional
    public User findById(Long id, boolean isAuthorized) {
        UserSpringSecurity userSpringSecurity = authenticated();

        if (!isAuthorized && (!Objects.nonNull(userSpringSecurity) || !userSpringSecurity.hasRole(ProfileEnum.ADMIN) && !id.equals(userSpringSecurity.getId()))) {
            throw new AuthorizationException("Acesso negado");
        }

        return userRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Usuário não encontrado."));
    }

    @Transactional
    public User create(User user, Set<ProfileEnum> profiles) {
        if (!isAdmin()) {
            throw new AuthorizationException("Acesso negado");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(EStatus.ATIVO);
        user.setProfiles(profiles.stream().map(ProfileEnum::getCode).collect(Collectors.toSet()));
        return userRepository.save(user);
    }

    @Transactional
    public User update(Long id, User user, Set<ProfileEnum> profiles) {
        User userFound = findById(id, false);

        userFound.setName(user.getName());

        if (user.getPassword() != "") {
            userFound.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        if (isAdmin() && id != 1) {
            userFound.setProfiles(profiles.stream().map(ProfileEnum::getCode).collect(Collectors.toSet()));
        }

        return userRepository.save(userFound);
    }

    @Transactional
    public void delete(Long id) {
        if (!isAdmin()) {
            throw new AuthorizationException("Acesso negado");
        }

        if (id.equals(1L)) {
            throw new DataIntegrityViolationException("Usuário de id 1 não pode ser excluído.");
        }

        User userFound = findById(id, false);
        userRepository.delete(userFound);
    }

    @Transactional
    public void disable(Long id) {
        if (!isAdmin()) {
            throw new AuthorizationException("Acesso negado");
        }

        User userFound = findById(id, false);
        userFound.setStatus(EStatus.INATIVO);
        userRepository.save(userFound);
    }

    @Transactional
    public void enable(Long id) {
        if (!isAdmin()) {
            throw new AuthorizationException("Acesso negado");
        }

        User userFound = findById(id, false);
        userFound.setStatus(EStatus.ATIVO);
        userRepository.save(userFound);
    }

    @Transactional
    public List<User> findAll(boolean isAuthorized) {
        if (!isAdmin() && !isAuthorized) {
            throw new AuthorizationException("Acesso negado");
        }

        return userRepository.findAll();
    }

    @Transactional
    public int myTasksCount() {
        UserSpringSecurity userSpringSecurity = authenticated();
        return taskRepository.countByResponsibleId(userSpringSecurity.getId());
    }
}

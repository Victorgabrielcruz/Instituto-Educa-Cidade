package com.educacidades.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.educacidades.models.project.Project;
import com.educacidades.models.user.User;
import com.educacidades.repositories.ProjectRepository;
import com.educacidades.security.UserSpringSecurity;
import com.educacidades.services.exceptions.ObjectNotFoundException;

import jakarta.transaction.Transactional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserService userService;

    @Transactional
    public Project create(Project project) {
        try {
            List<User> admins = userService.findAllAdmins();
            for (User admin : admins) {
                project.getUsers().add(admin);
            }
            return projectRepository.save(project);
        } catch (DataIntegrityViolationException exception) {
            throw new DataIntegrityViolationException("Já existe um projeto cadastrado com o código informado.");
        }
    }

    @Transactional
    public Project update(Long id, Project project) {
        User admin = userService.findById(1L, true);
        Project projectFound = findById(id);

        projectFound.setTitle(project.getTitle());
        projectFound.setDescription(project.getDescription());
        projectFound.setObjective(project.getObjective());
        projectFound.setCity(project.getCity());
        projectFound.setState(project.getState());
        projectFound.setCountry(project.getCountry());
        projectFound.setUsers(project.getUsers());
        projectFound.getUsers().add(admin);
        projectFound.setExpectedStart(project.getExpectedStart());
        projectFound.setExpectedEnd(project.getExpectedEnd());

        return projectRepository.save(projectFound);
    }

    @Transactional
    public Project findById(Long id) {
        UserSpringSecurity user = UserService.authenticated();
        return projectRepository.findByIdAndUsersId(id, user.getId()).orElseThrow(() -> new ObjectNotFoundException("Projeto não encontrado ou usuário sem permissão."));
    }

    @Transactional
    public List<Project> findAll() {
        UserSpringSecurity userSpringSecurity = UserService.authenticated();
        return projectRepository.findByUsersId(userSpringSecurity.getId());
    }

    @Transactional
    public List<User> findAllUsers(Long projectId) {
        return projectRepository.findAllUsersByProjectId(projectId);
    }

    @Transactional
    public List<Project> findByTitle(String title) {
        return projectRepository.findByTitleIgnoreCaseContaining(title);
    }

    @Transactional
    public void delete(Long id) {
        Project projectFound = findById(id);
        projectRepository.delete(projectFound);
    }
}

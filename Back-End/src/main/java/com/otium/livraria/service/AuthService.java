package com.otium.livraria.service;

import com.otium.livraria.dto.AuthResponse;
import com.otium.livraria.dto.LoginRequest;
import com.otium.livraria.dto.RegisterRequest;
import com.otium.livraria.dto.UserResponse;
import com.otium.livraria.entity.Role;
import com.otium.livraria.entity.User;
import com.otium.livraria.exception.EmailAlreadyExistsException;
import com.otium.livraria.exception.InvalidCredentialsException;
import com.otium.livraria.exception.ResourceNotFoundException;
import com.otium.livraria.repository.UserRepository;
import com.otium.livraria.security.JwtService;
import java.util.Locale;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalize(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException();
        }
        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        try {
            userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException e) {
            // corrida entre duas requisições com o mesmo e-mail: a constraint UNIQUE do banco decide
            throw new EmailAlreadyExistsException();
        }
        return toAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = normalize(request.email());
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        } catch (AuthenticationException e) {
            // mesma resposta para e-mail inexistente, senha errada ou conta inativa: não revela qual foi
            throw new InvalidCredentialsException();
        }
        User user = userRepository.findByEmail(email).orElseThrow(InvalidCredentialsException::new);
        return toAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse me(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
        return toResponse(user);
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(jwtService.generateToken(user), "Bearer",
                jwtService.getExpirationSeconds(), toResponse(user));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    private String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}

package com.otium.livraria.dto;

import com.otium.livraria.entity.Role;
import java.util.UUID;

public record UserResponse(UUID id, String name, String email, Role role) {
}

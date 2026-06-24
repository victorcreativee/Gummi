package com.gummi.project.dto;

import java.util.UUID;

public class CreateProjectRequest {
    public UUID ownerId;
    public String title;
    public String description;
    public String category;
    public String neededRoles;
}
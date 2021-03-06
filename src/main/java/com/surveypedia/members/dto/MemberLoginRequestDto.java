package com.surveypedia.members.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class MemberLoginRequestDto {

    private String email;
    private String pass;
}

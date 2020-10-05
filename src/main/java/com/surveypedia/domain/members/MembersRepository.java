package com.surveypedia.domain.members;

import com.surveypedia.tools.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface MembersRepository extends JpaRepository<Members, String> {


    @Query(value = "SELECT * FROM members WHERE email = ? AND pass = PASSWORD(?)", nativeQuery = true)
    Members login(String email, String pass);

    @Transactional
    @Modifying
    @Query(value = SQL.Members.MEMBER_PASS_UPDATE, nativeQuery = true)
    void changePass(String pass, String email);
}

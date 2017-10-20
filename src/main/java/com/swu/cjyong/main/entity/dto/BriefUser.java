package com.swu.cjyong.main.entity.dto;

import com.swu.cjyong.main.entity.User;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class BriefUser {
    private Long id;
    private String name;
    private String account;
    private int numPass = 0;

    public static BriefUser UserToBriefUser(User user){
        if (user == null) return null;
        return new BriefUser()
                .setId(user.getId())
                .setName(user.getName())
                .setAccount(user.getAccount())
                .setNumPass(null == user.getNumPass() ? 0 : user.getNumPass());
    }
}
package com.swu.cjyong.main.service;

import com.swu.cjyong.main.entity.Activity;
import com.swu.cjyong.main.entity.dto.ComAct;
import com.swu.cjyong.main.entity.dto.ComActs;
import com.swu.cjyong.main.entity.dto.ComTypes;

import java.util.List;

public interface ActivityService {
    /**
     * 上传活动信息
     *
     * @param activity
     * @return
     */
    Activity uploadActivity(Activity activity);

    /**
     * 根据ID获取活动信息
     *
     * @param id
     * @return
     */
    Activity getActivityById(long id);

    /**
     * 根据ID删除活动信息
     *
     * @param id
     * @return
     */
    Activity deleteActivityById(long id);

    /**
     * 根据ID审批通过活动
     *
     * @param id
     * @return
     */
    Activity checkPassById(long id);

    /**
     * 获取首页的活动信息
     *
     * @return ComActs
     */
    ComActs getIndexAct();

    /**
     * 根据ID获取二级账户的信息详情
     *
     * @param id
     * @return
     */
    long countBySecondAccountId(long id);

    /**
     * 根据账户类型统计活动数量
     *
     *
     * @return
     */
    ComTypes countByUserType();


    /**
     * 获取一个类别的活动信息
     *
     * @return ComActs
     */
    List<ComAct> getActByType(String type);

    /**
     * 获取用户上传的所有活动信息
     *
     * @return ComActs
     */
    List<Activity> getActByUserId(Long userId, String userGrade);
}

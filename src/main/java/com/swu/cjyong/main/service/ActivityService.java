package com.swu.cjyong.main.service;

import com.swu.cjyong.main.entity.Activity;

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
}

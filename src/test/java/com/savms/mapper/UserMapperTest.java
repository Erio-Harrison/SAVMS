package com.savms.mapper;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.savms.ApplicationSAVMS;
import com.savms.entity.Account;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.BeansException;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@ContextConfiguration(classes = ApplicationSAVMS.class)
public class UserMapperTest implements ApplicationContextAware {
    private ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Test
    public void testCRUD() {
        UserMapper mapper = applicationContext.getBean(UserMapper.class);

        Account entity = new Account();
        entity.setPassword("123456");
        entity.setAccount("abcde");
        entity.setRole(1);

        mapper.insert(entity);

        QueryWrapper<Account> selQuery = new QueryWrapper<>();
        selQuery.eq("account", "abcde");
        Account selected = mapper.selectOne(selQuery);
        Assert.assertEquals("abcde", selected.getAccount());
        Assert.assertEquals(1, (int)selected.getRole());

        mapper.deleteById(selected.getId());
        Assert.assertEquals(0, (long)mapper.selectCount(selQuery));
    }
}

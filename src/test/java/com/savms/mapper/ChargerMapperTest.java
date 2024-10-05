package com.savms.mapper;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.savms.ApplicationSAVMS;
import com.savms.entity.Charger;
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
public class ChargerMapperTest implements ApplicationContextAware {
    private ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Test
    public void testCRUD() {
        ChargerMapper mapper = applicationContext.getBean(ChargerMapper.class);

        Charger entity = new Charger();
        entity.setStationId(2L);
        entity.setName("abc");
        entity.setLocation("anu, act, australia");
        entity.setType(1);
        entity.setMaxPower(12.5F);
        entity.setConnectorType(1);

        mapper.insert(entity);

        QueryWrapper<Charger> selQuery = new QueryWrapper<>();
        selQuery.eq("name", "abc");
        Charger selected = mapper.selectOne(selQuery);
        Assert.assertEquals("abc", selected.getName());
        Assert.assertEquals(1, (int)selected.getType());

        mapper.deleteById(selected.getId());
        Assert.assertEquals(0, (long)mapper.selectCount(selQuery));
    }
}

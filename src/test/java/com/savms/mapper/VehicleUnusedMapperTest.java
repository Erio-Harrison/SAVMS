package com.savms.mapper;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.savms.ApplicationSAVMS;
import com.savms.entity.VehicleUnused;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.BeansException;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;

@RunWith(SpringRunner.class)
@SpringBootTest
@ContextConfiguration(classes = ApplicationSAVMS.class)
public class VehicleUnusedMapperTest implements ApplicationContextAware {
    private ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Test
    public void testCRUD() {
        VehicleMapper mapper = applicationContext.getBean(VehicleMapper.class);

        VehicleUnused entity = new VehicleUnused();
        entity.setRegistrationNumber("123456");
        entity.setRegistrationDate(new Date());
        entity.setBatteryLevel(1.5F);
        entity.setCurrentLocation("bel, act, australia");
        entity.setStatus(2);
        entity.setLastUpdate(new Date());

        mapper.insert(entity);

        QueryWrapper<VehicleUnused> selQuery = new QueryWrapper<>();
        selQuery.eq("registration_number", "123456");
        VehicleUnused selected = mapper.selectOne(selQuery);
        Assert.assertEquals("123456", selected.getRegistrationNumber());

        mapper.deleteById(selected.getId());
        Assert.assertEquals(0, (long)mapper.selectCount(selQuery));
    }
}


import React, { useState } from 'react';
import {Modal, SplitButtonGroup, Button, Dropdown, Form, Toast  } from '@douyinfe/semi-ui';
import { IconTreeTriangleDown } from '@douyinfe/semi-icons';
import axiosInstance from '../../axiosInstance';
export default function CarOperationButton() {
    const [btnVisible, setBtnVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const menu = [
        { node: 'item', name: 'Add Vehicle', onClick: () => handleAddVehicleClick() },
        { node: 'divider' },
        { node: 'item', name: 'Delete Vehicle', type: 'danger' },
    ];

    const handleVisibleChange = (visible) => {
        setBtnVisible(visible);
    };

    const handleAddVehicleClick = () => {
        setModalVisible(true);
    };
    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleSubmit = async (values) => {
        try {
            const res = await axiosInstance.post('/vehicles/add', values);
            Toast.success('Vehicle added successfully!');
            setModalVisible(false);
        } catch (error) {
            console.error('Error adding vehicle:', error);
            Toast.error('Failed to add vehicle');
        }
    };


    return (
    <>
        <SplitButtonGroup style={{ marginRight: 10 }} aria-label="项目操作按钮组">
            <Dropdown
                onVisibleChange={handleVisibleChange}
                menu={menu}
                trigger="click"
                position="bottomRight"
            >
                <Button
                    style={btnVisible
                        ? { background: 'var(--semi-color-primary-hover)', padding: '8px 4px' }
                        : { padding: '8px 4px' }}
                    theme="solid"
                    type="primary"
                    icon={<IconTreeTriangleDown />}
                />
            </Dropdown>
        </SplitButtonGroup>

            <Modal
                title="自定义样式"
                visible={modalVisible}
                //TODO: implement handle OK
                //onOk={this.handleOk}
                 onCancel={handleCancel}
                centered
                bodyStyle={{ overflow: 'auto', height: 200 }}
            >
{/*                 TODO: change to real submit   */}
                <p style={{ lineHeight: 1.8 }}>
                    Semi Design 是由抖音前端团队与 UED
                    团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
                    Web 应用。
                </p>
                <p style={{ lineHeight: 1.8 }}>
                    区别于其他的设计系统而言，Semi Design 以用户中心、内容优先、设计人性化为设计理念，具有以下优势：
                </p>
                <ul>
                    <li>
                        <p>Semi Design 以内容优先进行设计。</p>
                    </li>
                    <li>
                        <p>更容易地自定义主题。</p>
                    </li>
                    <li>
                        <p>适用国际化场景。</p>
                    </li>
                    <li>
                        <p>效率场景加入人性化关怀</p>
                    </li>
                </ul>
            </Modal>
            </>
    );
}
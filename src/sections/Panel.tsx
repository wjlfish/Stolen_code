import React, { Component as Cp } from "react";
import mainStyles from "../css/main.module.css";
import { Button, ConfigProvider, Menu, Modal } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { BarChartOutlined, FlagOutlined, IdcardOutlined, SettingOutlined, SnippetsOutlined } from "@ant-design/icons";
import meta from "../meta";
import { MenuInfo } from "rc-menu/lib/interface";
import UserManage from "../tabs/UserManage";
import OrderManage from "../tabs/OrderManage";
import EventManage from "../tabs/EventManage";
import Statistics from "../tabs/Statistics";
import Settings from "../tabs/Settings";
import Lucky from "../sections/lucky/Lucky";
import { NoticeType } from "antd/es/message/interface";

type Props = {
    ATFailCallBack :(message?: string)=>void;
    sendMessage :(content :string, type :NoticeType)=>void;
};

type State = {
    currentKey :string;
    menuRefresher :number;
    aboutModalOpened :boolean;
};

/**@once */
export default class Panel extends Cp<Props, State>{
    items :ItemType<MenuItemType>[] = [
        {
            key: "lucky",
            label: "抽取管理",
            icon: <IdcardOutlined />
        }
    ];
    mapping = ["users", "lucky", "orders", "events", "stats", "settings"];
    constructor(props :Props){
        super(props);
        const hash = window.location.hash.substring(1, window.location.hash.length), index = this.mapping.indexOf(hash);
        this.state = {
            currentKey: index !== -1 ? hash : "lucky",
            aboutModalOpened: false,
            menuRefresher: Date.now()
        };
    }
    componentDidMount(){
        window.addEventListener("popstate", this.route);
    }
    route = (event :PopStateEvent)=>{
        const hash = window.location.hash.substring(1, window.location.hash.length), index = this.mapping.indexOf(hash);
        if(index !== -1) this.setState({
            currentKey: hash,
            menuRefresher: this.state.menuRefresher + 1
        });
    }
    changeTab = (info :MenuInfo)=>{
        this.setState({currentKey: info.key});
        window.history.pushState("", "", `#${info.key}`);
    }
    render() :React.ReactNode{
        return(
            <div className={mainStyles.fullScreen} style={{
                display: "flex",
                flexFlow: "row nowrap"
            }}>
                <Menu className={mainStyles.noselect}
                    key={this.state.menuRefresher}
                    style={{
                        width: "10rem",
                        height: "100dvh"
                    }}
                    defaultSelectedKeys={[this.state.currentKey]}
                    mode="inline"
                    items={this.items}
                    onClick={this.changeTab}
                />
                <div style={{
                    position: "absolute",
                    left: ".9rem",
                    bottom: "1rem",
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                }}>
                    {/* <div>{meta.version} {meta.dev ? "开发版" : ""}</div> */}
                    {/* <div>
                        <ConfigProvider theme={{components: {Button: {paddingInline: 0, textHoverBg: "transparent", colorBgTextActive: "transparent"}}}}><Button type="text" onClick={()=>this.setState({aboutModalOpened: true})}>关于</Button></ConfigProvider>
                        <Modal
                            open={this.state.aboutModalOpened}
                            footer={null}
                            onCancel={()=>this.setState({aboutModalOpened: false})}
                            width={"60dvw"}
                            closable={false}
                        >{meta.about}</Modal>
                    </div> */}
                </div>
                {this.state.currentKey === "lucky" ? <Lucky ATFailCallBack={this.props.ATFailCallBack} /> : null}
            </div>
        );
    }
}
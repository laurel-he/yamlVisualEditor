import React, { Component } from "react";
import LabelingLoader from 'src/utils/common/LabelTool/LabelingLoader';
import { pageHeader } from "src/systems/Layout/modules/PageHeader";
import { Authorization } from 'src/systems/clusterCtrl/common/utils/Authorization';
import {
  backendAiTrainingPhotoCutCutRecordStatistics,
  BackendAiTrainingPhotoCutStatisticsBlockItemList,
  backendAiTrainingPhotoCutStatistics} from 'src/systems/kzBackend/common/api';
import { message, Table, DatePicker, Button, Divider} from 'antd';
import { Pie, yuan } from 'ant-design-pro/lib/Charts';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';
moment.locale('zh-cn');
const RangePicker = DatePicker.RangePicker;
import { showErrorNotification } from 'src/utils/dynamic';

interface MainViewState {
  sampleStat?: BackendAiTrainingPhotoCutStatisticsBlockItemList[]
  loading?: boolean
  recordStats?: any[]
  recordEditStats?: any[]
  searchStatus: number
}
const defualtDateRange = [moment('00:00:00', 'HH:mm:ss').startOf('week'), moment()]

export default class InstanceSegmentationStatistics extends Component<any, MainViewState> {

  lablelTool = React.createRef<LabelingLoader>();

  constructor(props) {
    super(props);
    this.state = {recordStats: [], recordEditStats: [], sampleStat: [], searchStatus: 0}
    pageHeader.title = '实例分割';
    this.handleRangePickerChange(defualtDateRange)
  }
  UNSAFE_componentWillMount() {
    this.fetchPointStat()
  }
  fetchPointStat() {
    this.setState({loading: true})
    backendAiTrainingPhotoCutStatistics({}).then(data => this.setState({sampleStat: data.itemList, loading: false})).catch(e => showErrorNotification(e))
  }
  setStatus(status: number) {
    this.setState({
      searchStatus: status
    })
  }

  disabledDate(current) {
    // Can not select days after today
    return current && current > moment().endOf('day');
  }

  handleRangePickerChange(dates, dateStrings = null) {
    // console.log('handleRangePickerChange :', )
    if ( (dates[1].unix() - dates[0].unix()) > ( 65 * 86400 ) ) {
      message.error('查询时间范围不可超过2个月!');
    } else {
      const start = dates[0].unix()
      const end = dates[1].endOf('day').unix()
      backendAiTrainingPhotoCutCutRecordStatistics({start, end, 'checked': this.state.searchStatus}).then(data =>
        this.setState({recordStats: data.itemList.map( item => ({x: item._id, y: item.total}))})
      ).catch( e => showErrorNotification(e))
    }
  }

  renderDateRangeSelection() {
    return <RangePicker
      showTime
      locale={locale}
      allowClear={false}
      format="YYYY-MM-DD"
      disabledDate={this.disabledDate}
      onChange={this.handleRangePickerChange.bind(this)}
      defaultValue={defualtDateRange as any}
      ranges={{
        '今天': [moment('00:00:00', 'HH:mm:ss'), moment().endOf('day')],
        '本周': [moment('00:00:00', 'HH:mm:ss').startOf('week'), moment()],
        '上周': [moment().week(moment().week() - 1).startOf('week'), moment().week(moment().week() - 1).endOf('week')],
        '本月': [moment().startOf('month'), moment().endOf('month')],
        '上月': [moment().month(moment().month() - 1).startOf('month'), moment().month(moment().month() - 1).endOf('month')],
        '最近半年': [moment().month(moment().month() - 6).startOf('month'), moment().endOf('day')],
      }}
     />
  }

  renderSampleRecordChart(): React.ReactNode {
    return <div className="markRecordPie">
    <div>
      <div>
        <Button onClick={() => this.setStatus(0)}>统计全部</Button>
        <Divider type="vertical"/>
        <Button onClick={() => this.setStatus(4)}>统计已审核通过</Button>
        <Divider type="vertical"/>
      </div>
      <h3>样本标注统计(新增)： </h3>
      {this.renderDateRangeSelection()}
      <br/>
      <br/>
      <Pie hasLegend title="标注新增统计" subTitle="标注新增统计"
          total={() => (
            <span
              dangerouslySetInnerHTML={{
                __html: (this.state.recordStats.reduce((pre, now) => now.y + pre, 0))
              }}
            />
          )}
          data={this.state.recordStats}
          valueFormat={val => <span dangerouslySetInnerHTML={{ __html: (val) }} />}
          height={294}
        />
      </div>

      <div>
      </div>
    </div>
  }

  render() {
    return (
      <div>
            {this.renderSampleRecordChart()}
          <br/>
          <br/>
          </div>
    );
  }
}

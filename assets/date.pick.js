/**
 * 日期选择控件
 * @Filename : date.pick.js
 * @Author : shiyuan
 * @Finished ：2015年5月12日
 * @Modified By ：shiyuan
 * @Modified Date : 2015年5月26日
 * @Modified Reasons : 增加设置默认日期
 * @Modified By ：shiyuan
 * @Modified Date : 2015年7月2日
 * @Modified Reasons : 添加设置值、获取值方法
 */
// 防止其他文件结尾没有写分号
;
// 获取当前文件路径
var DATE_PICK_FILE = $("script").last().attr("src");
(function($) {
    var methods = {
        // 初始化
        init: function(options) {
            // 在每个元素上执行方法
            return this
                .each(function() {
                    var $this = $(this);
                    // 尝试去获取settings，如果不存在，则返回“undefined”
                    var settings = $this.data('datePicker');
                    // 如果获取settings失败，则根据options和default创建它
                    if (typeof(settings) == 'undefined') {
                        var defaults = {
                            // 绑定事件类型 click, focus
                            event: 'click',
                            // 颜色主题 green, blood
                            theme: null,
                            // 日期选择类型 month, week, day
                            type: 'day',
                            // 日期格式化
                            fmtDay: 'yyyy-MM-dd',
                            // 日期格式化
                            fmtWeek: '第ww周',
                            // 日期格式化
                            fmtMonth: 'yyyy年MM月',
                            // 默认日期天
                            selectDay: new Date(),
                            // 默认日期周
                            selectWeek: new Date(),
                            // 默认日期月
                            selectMonth: new Date(),
                            // 最小日期
                            minDate: null,
                            // 最大日期
                            maxDate: null,
                            // 输入框宽度
                            inputWidth: 100,
                            // 是否打开
                            open: false,
                            // 选中事件
                            onSelect: null,
                            // 当前值
                            value: null,
                            // 层级
                            zIndex: 10000
                        }
                        settings = $.extend({}, defaults, options);
                        // 保存我们新创建的settings
                        $this.data('datePicker', settings);
                    } else {
                        // 如果我们获取了settings，则将它和options进行合并（这不是必须的，你可以选择不这样做）
                        settings = $.extend({}, settings, options);
                        // 保存我们新创建的settings
                        $this.data('datePicker', settings);
                    }
                    // 执行代码
                    // 加载样式文件
                    var loadCssFile = function(name) {
                        var elem = document.createElement('link');
                        elem.setAttribute("rel", "stylesheet");
                        elem.setAttribute("type", "text/css");
                        elem.setAttribute("href", name);
                        $(document.body).append(elem);
                    };
                    DATE_PICK_FILE = DATE_PICK_FILE.substr(0, DATE_PICK_FILE.lastIndexOf('/'));
                    DATE_PICK_FILE = DATE_PICK_FILE != '' ? DATE_PICK_FILE + '/' : '';
                    loadCssFile(DATE_PICK_FILE + '/date.pick.css');
                    if (settings.theme) {
                        loadCssFile(DATE_PICK_FILE + 'theme/' + settings.theme + '.css');
                    }
                    // 装载
                    var loadPicker = function() {
                        if (settings.disabled) {
                            return;
                        }
                        // 目标绝对位置，用于定位组件
                        var targetOffsetLeft = target.offset().left;
                        var targetOffsetTop = target.offset().top;
                        var calendar = $('#calendar_' + targetName);
                        if (calendar.length == 0) {
                            $(document.body)
                                .append(
                                    '<div id="calendar_' + targetName + '" class="calendar">\
                            <div class="calendar_header">' + '<div class="calendar_nav calendar_p_y">&lt;&lt;</div>\
                            <div class="calendar_nav calendar_p_m">&lt;</div><div class="calendar_nav calendar_n_m">&gt;</div>\
                            <div class="calendar_nav calendar_n_y">&gt;&gt;</div><div class="calendar_title"></div></div>\
                            <div class="calendar_body"><ul></ul></div></div>');
                            calendar = $('#calendar_' + targetName);
                        } else {
                            calendar.remove();
                            return;
                        }
                        calendar.css({
                            left: targetOffsetLeft - 5,
                            top: targetOffsetTop + target.outerHeight() + 2,
                            zIndex: settings.zIndex
                        });
                        var calendar_header = calendar.find('div.calendar_header');
                        // 根据不同类型设置数据
                        var setPickData = function(date) {
                            switch (settings.type) {
                                case 'month':
                                    setMonthData(date);
                                    break;
                                case 'week':
                                    setWeekData(date);
                                    break;
                                case 'day':
                                    setDayData(date);
                                    break;
                            }
                            calendar.find('ul').find('li.disabled').unbind('click');
                        };
                        // 填充天数据
                        var setDayData = function(date) {
                                // 对象
                                var calendar_header = calendar.find('div.calendar_header');
                                var calendar_title = calendar.find('div.calendar_title');
                                var calendar_body = calendar.find('div.calendar_body');
                                var calendar_ul = calendar.find('ul');
                                var yearMonthDay = getYearMonthDays(date);
                                var dayWeek = ['一', '二', '三', '四', '五', '六', '日'];
                                // 设置TITLE
                                var year = date.getFullYear();
                                var title = settings.fmtMonth.replace(/(y+)/, year).replace(/(M+)/, date.getMonth() + 1);
                                calendar_title.html(title);
                                calendar_ul.empty();
                                var html = '';
                                for (var i = 0; i < dayWeek.length; i++) { // 打出第一行星期行
                                    html += '<li class="day_head">' + dayWeek[i] + '</li>';
                                }
                                for (var i = 0; i < yearMonthDay.length; i++) {
                                    var temp = yearMonthDay[i];
                                    var style = settings.type;
                                    if (date.getMonth() != temp.dateVal.getMonth()) {
                                        style += ' gray'; // 不是本月的样式
                                    }
                                    if (temp.cols == 6) {
                                        style += ' sat'; // 周六样式
                                    } else if (temp.cols == 7) {
                                        style += ' sun'; // 周日样式
                                    }
                                    if (date.getMonth() == temp.dateVal.getMonth() && date.getDate() == temp.dateVal.getDate()) {
                                        style += ' selected';
                                    }
                                    style += checkRestrictDate(temp.dateVal);
                                    var data = ' data-options="' + formatDays(temp.dateVal) + '"';
                                    html += '<li class="' + style + '"' + data + '>' + formatDays(temp.dateVal).substr(8) + '</li>';
                                }
                                calendar_ul.append(html);
                                // 绑定点击事件
                                calendar_ul.find('li.day').click(
                                    function() {
                                        $(this).siblings('li').removeClass('selected').end().addClass('selected');
                                        var data = $(this).attr('data-options');
                                        var dataVal = data.split('-');
                                        settings.selectDay
                                            .setFullYear(dataVal[0], parseInt(dataVal[1], 10) - 1, dataVal[2]);
                                        dataVal = settings.fmtDay.replace(/(y+)/, dataVal[0]).replace(/(M+)/, dataVal[1])
                                            .replace(/(d+)/, dataVal[2]);
                                        target.val(dataVal);
                                        target.parent().find('small').remove();
                                        removePicker();
                                        settings.value = data;
                                        if (settings.onSelect) {
                                            settings.onSelect(data);
                                        }
                                    });
                            },
                            // 填充周数据
                            setWeekData = function(date) {
                                // 对象
                                var calendar_header = calendar.find('div.calendar_header');
                                var calendar_title = calendar.find('div.calendar_title');
                                var calendar_body = calendar.find('div.calendar_body');
                                var calendar_ul = calendar.find('ul');
                                // 设置TITLE
                                var year = date.getFullYear();
                                var title = settings.fmtMonth.replace(/(y+)/, year).replace(/(M+)/, date.getMonth() + 1);
                                calendar_title.html(title);
                                calendar_ul.empty();
                                var html = '';
                                var yearWeeks = getYearWeeks(year);
                                for (var i = 0; i < yearWeeks.length; i++) {
                                    var obj = yearWeeks[i];
                                    var style = settings.type;
                                    if (date.getTime() >= obj.monday.getTime() && date.getTime() <= obj.sunday.getTime()) {
                                        style += ' selected';
                                    }
                                    var data = ' data-options="' + year + '-' + obj.index + ',' + formatDays(obj.monday) + ',' + formatDays(obj.sunday) + '"';
                                    html += '<li class="' + style + '"' + data + '><span>第' + obj.index + '周</span>\
                                <i>' + formatDays(obj.monday).substr(5) + '至' + formatDays(obj.sunday).substr(5) + '</i></li>';
                                }
                                calendar_ul.append(html);
                                // 绑定点击事件
                                calendar_ul.find('li').click(function() {
                                    $(this).siblings('li').removeClass('selected').end().addClass('selected');
                                    var data = $(this).attr('data-options');
                                    var weekVal = data.split(',')[0].split('-');
                                    var dataVal = data.split(',')[1].split('-');
                                    var monday = data.split(',')[1],
                                        sunday = data.split(',')[2];
                                    var smallHmtl = '<i>' + monday.substr(5, 5) + '至';
                                    smallHmtl += sunday.substr(5, 5) + '</i>';
                                    settings.selectWeek.setFullYear(dataVal[0], parseInt(dataVal[1], 10) - 1, dataVal[2]);
                                    weekVal = settings.fmtWeek.replace(/(y+)/, weekVal[0]).replace(/(w+)/, weekVal[1]);
                                    target.val(weekVal);
                                    target.parent().find('i').remove();
                                    target.parent().append(smallHmtl);
                                    removePicker();
                                    settings.value = data;
                                    if (settings.onSelect) {
                                        settings.onSelect(data);
                                    }
                                });
                                // 滚动到选中日期位置
                                var selectTop = calendar_ul.find('li.selected').offset().top;
                                var ulTop = calendar_ul.offset().top;
                                calendar_body.animate({
                                    scrollTop: selectTop - ulTop - 60
                                }, 100);
                            },
                            // 填充月数据
                            setMonthData = function(date) {
                                // 对象
                                var calendar_header = calendar.find('div.calendar_header');
                                var calendar_title = calendar.find('div.calendar_title');
                                var calendar_body = calendar.find('div.calendar_body');
                                var calendar_ul = calendar.find('ul');
                                var yearMonth = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
                                // 设置TITLE
                                var year = date.getFullYear();
                                var title = settings.fmtMonth.replace(/(y+)/, year).replace(/(M+)/, date.getMonth() + 1);
                                calendar_title.html(title);
                                calendar_ul.empty();
                                var html = '';
                                for (var i = 0; i < yearMonth.length; i++) {
                                    var monthText = yearMonth[i];
                                    var fDay = new Date(year, i, 1);
                                    var lDay = new Date(fDay.getFullYear(), fDay.getMonth() + 1, 1);
                                    lDay.setDate(lDay.getDate() - 1);
                                    var style = settings.type;
                                    if (date.getMonth() == i) {
                                        style += ' selected';
                                    }
                                    style += checkRestrictDate(fDay);
                                    var data = ' data-options="' + year + '-' + fixZore(i + 1) + ',' + formatDays(fDay) + ',' + formatDays(lDay) + '"';
                                    html += '<li class="' + style + '"' + data + '>' + monthText + '</li>';
                                }
                                calendar_ul.append(html);
                                // 绑定点击事件
                                calendar_ul.find('li').click(function() {
                                    $(this).siblings('li').removeClass('selected').end().addClass('selected');
                                    var data = $(this).attr('data-options');
                                    var monthVal = data.split(',')[0].split('-');
                                    var dataVal = data.split(',')[1].split('-');
                                    settings.selectMonth.setFullYear(dataVal[0], parseInt(dataVal[1], 10) - 1, dataVal[2]);
                                    monthVal = settings.fmtMonth.replace(/(y+)/, monthVal[0]).replace(/(M+)/, monthVal[1]);
                                    target.val(monthVal);
                                    target.parent().find('i').remove();
                                    removePicker();
                                    settings.value = data;
                                    if (settings.onSelect) {
                                        settings.onSelect(data);
                                    }
                                });
                            },
                            // 判断日期是否在范围内
                            checkRestrictDate = function(date) {
                                if (settings.minDate) {
                                    if (settings.minDate > date) {
                                        return ' disabled';
                                    }
                                }
                                if (settings.maxDate) {
                                    if (settings.maxDate <= date) {
                                        return ' disabled';
                                    }
                                }
                                return '';
                            };
                        var current = new Date();
                        switch (settings.type) {
                            case 'day':
                                current.setFullYear(settings.selectDay.getFullYear(), settings.selectDay.getMonth(),
                                    settings.selectDay.getDate());
                                break;
                            case 'week':
                                current.setFullYear(settings.selectWeek.getFullYear(), settings.selectWeek.getMonth(),
                                    settings.selectWeek.getDate());
                                break;
                            case 'month':
                                current.setFullYear(settings.selectMonth.getFullYear(),
                                    settings.selectMonth.getMonth(), settings.selectMonth.getDate());
                                break;
                        }
                        current.setHours(0, 0, 0, 0);
                        // 上一年
                        calendar_header.find('div.calendar_p_y').click(function() {
                            current.setFullYear(current.getFullYear() - 1, current.getMonth(), current.getDate());
                            setPickData(current);
                        });
                        // 上一月
                        calendar_header.find('div.calendar_p_m').click(function() {
                            current.setMonth(current.getMonth() - 1, current.getDate());
                            setPickData(current);
                        });
                        // 下一月
                        calendar_header.find('div.calendar_n_m').click(function() {
                            current.setMonth(current.getMonth() + 1, current.getDate());
                            setPickData(current);
                        });
                        // 下一年
                        calendar_header.find('div.calendar_n_y').click(function() {
                            current.setFullYear(current.getFullYear() + 1, current.getMonth(), current.getDate());
                            setPickData(current);
                        });
                        // 设置默认值
                        setPickData(current);
                        // 点击document移除层
                        $(document).on('click', function() {
                            removePicker();
                        });
                        // 点击日历层阻止事件冒泡
                        calendar.bind('click', function(event) {
                            stopPropagation(event);
                        });
                        // 移除控件
                        var removePicker = function() {
                            $('.calendar').remove();
                            calendar = null;
                            $(document).off('click');
                        };
                        // 重新定位组件
                        var reLocation = function() {
                            targetOffsetLeft = target.offset().left;
                            targetOffsetTop = target.offset().top;
                            if (calendar && calendar.length > 0) {
                                calendar.css({
                                    left: targetOffsetLeft - 1,
                                    top: targetOffsetTop + target.outerHeight() + 2
                                });
                            }
                        };
                        // 改变窗体尺寸时
                        window.onresize = reLocation;
                    };
                    // 对象
                    var target = $(this),
                        targetName = target.attr('id');
                    // 不要时间部分，设置为0
                    settings.selectDay.setHours(0, 0, 0, 0);
                    settings.selectWeek.setHours(0, 0, 0, 0);
                    settings.selectMonth.setHours(0, 0, 0, 0);
                    // 阻止事件冒泡
                    var stopPropagation = function(e) {
                            if (e.stopPropagation) {
                                e.stopPropagation();
                            } else {
                                e.cancelBubble = true;
                            }
                        },
                        // 初始化
                        initPickerEvent = function() {
                            var icon = $('#icon_' + targetName);
                            if (icon.length == 0) {
                                var parent = document.createElement('span');
                                $(parent).attr('class', 'calendar_inputBox');
                                target.wrap(parent);
                                target.after('<span id="icon_' + targetName + '" class="calendar_btn"></span>');
                                icon = $('#icon_' + targetName);
                            }
                            // 绑定按钮选择事件
                            icon.off('click').on('click', function(event) {
                                stopPropagation(event);
                                loadPicker();
                            });
                            // 绑定文本框选择事件
                            target.parent().off(settings.event).on(settings.event, function(event) {
                                stopPropagation(event);
                                loadPicker();
                            });
                            // 自动打开
                            if (settings.open) {
                                loadPicker();
                            }
                        };
                    // 初始化
                    initPickerEvent();
                });
        },
        // 设置日期类型
        setType: function(options) {
            var settings = $(this).data('datePicker');
            settings.type = options;
            $(this).data('datePicker', settings);
            $(this).datePicker('setValue');
            return $(this);
        },
        // 设置值
        setValue: function(options) {
            var settings = $(this).data('datePicker');
            var dateVal = '',
                temp = [];
            if (options) {
                dateVal = options;
            } else {
                switch (settings.type) {
                    case 'month':
                        var monthVal = formatDays(settings.selectMonth);
                        temp = monthVal.split('-');
                        dateVal = settings.fmtMonth.replace(/(y+)/, temp[0]).replace(/(M+)/, temp[1]);
                        $(this).parent().find('i').remove();
                        $(this).removeClass().addClass('inputMin');
                        $(this).parent().removeClass('calendar_inputBox_max');
                        var fDay = new Date(settings.selectMonth.getFullYear(), settings.selectMonth.getMonth(), 1);
                        var lDay = new Date(fDay.getFullYear(), fDay.getMonth() + 1, 1);
                        lDay.setDate(lDay.getDate() - 1);
                        settings.value = monthVal.substr(0, 7) + ',' + formatDays(fDay) + ',' + formatDays(lDay);
                        break;
                    case 'week':
                        var weekVal = formatWeek(settings.selectWeek);
                        temp = weekVal.split('-');
                        dateVal = settings.fmtWeek.replace(/(y+)/, temp[0]).replace(/(w+)/, temp[1]);
                        var mondayAndSunday = getMonDayAndSunDay(temp[0] + '' + temp[1]);
                        var smallHmtl = '<i>' + mondayAndSunday.split(',')[0].substr(5, 5) + '至';
                        smallHmtl += mondayAndSunday.split(',')[1].substr(5, 5) + '</i>';
                        $(this).parent().find('i').remove();
                        $(this).parent().append(smallHmtl);
                        $(this).removeClass().addClass('inputMax');
                        $(this).parent().addClass('calendar_inputBox_max');
                        settings.value = weekVal + ',' + mondayAndSunday;
                        break;
                    case 'day':
                        var dayVal = formatDays(settings.selectDay);
                        temp = dayVal.split('-');
                        dateVal = settings.fmtDay.replace(/(y+)/, temp[0]).replace(/(M+)/, temp[1]).replace(/(d+)/,
                            temp[2]);
                        $(this).parent().find('i').remove();
                        $(this).removeClass().addClass('inputMin');
                        $(this).parent().removeClass('calendar_inputBox_max');
                        settings.value = dayVal + ',' + dayVal;
                        break;
                }
            }
            $(this).val(dateVal);
            $(this).data('datePicker', settings);
            return $(this);
        },
        // 获取值
        getValue: function(options) {
            var settings = $(this).data('datePicker');
            if (!settings) {
                return '';
            }
            if (settings.value && !options) {
                return settings.value;
            }
            if (!options) {
                options = settings.type
            }
            var dateVal = '',
                temp = [];
            switch (options) {
                case 'month':
                    temp = formatDays(settings.selectMonth);
                    var fDay = new Date(settings.selectMonth.getFullYear(), settings.selectMonth.getMonth(), 1);
                    var lDay = new Date(fDay.getFullYear(), fDay.getMonth() + 1, 1);
                    lDay.setDate(lDay.getDate() - 1);
                    dateVal = temp.substr(0, 7) + ',' + formatDays(fDay) + ',' + formatDays(lDay);
                    break;
                case 'week':
                    temp = formatWeek(settings.selectWeek);
                    dateVal = temp + ',' + getMonDayAndSunDay(temp);
                    break;
                case 'day':
                    temp = formatDays(settings.selectDay);
                    dateVal = temp + ',' + temp;
                    break;
            }
            return dateVal;
        },
        // 设置是否启用
        setDisabled: function(options) {
            var settings = $(this).data('datePicker');
            settings.disabled = options;
            $(this).data('datePicker', settings);
            if (options) {
                $(this).css({
                    background: '#eee',
                    color: '#aaa'
                }).parent().css({
                    background: '#eee'
                });
            } else {
                $(this).css({
                    background: '#fff',
                    color: '#000'
                }).parent().css({
                    background: '#fff'
                });
            }
            return $(this);
        },
        // 销毁
        destroy: function(options) {
            // 在每个元素中执行代码
            return $(this).each(function() {
                var $this = $(this);
                // 执行代码
                // 删除元素对应的数据
                $this.removeData('datePicker');
            });
        }
    };
    $.fn.datePicker = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.datePicker');
            return this;
        }
        return method.apply(this, arguments);
    };
    // 获取一年的全部周
    var getYearWeeks = function(year) {
            var firstDate = new Date(year, 0, 1);
            if (firstDate.getDay() != 1) { // 不是周一则以下周为第一天
                firstDate.setDate(firstDate.getDate() + (8 - changeSunday(firstDate.getDay())));
            }
            var array = new Array();
            var index = 0;
            while (year == firstDate.getFullYear()) {
                index++;
                var monday = new Date(firstDate.setDate(firstDate.getDate()));
                var sunday = new Date(firstDate.setDate(firstDate.getDate() + 6));
                monday.setHours(0, 0, 0, 0);
                sunday.setHours(0, 0, 0, 0);
                array.push({
                    index: fixZore(index),
                    monday: monday,
                    sunday: sunday
                });
                firstDate.setDate(firstDate.getDate() + 1)
            }
            return array;
        },
        // 获取某年某月的全部天
        getYearMonthDays = function(date) {
            var firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
            if (firstDate.getDay() != 1) { // 以这周一为第一天
                firstDate.setDate(firstDate.getDate() - (changeSunday(firstDate.getDay()) - 1));
            }
            firstDate.setHours(0, 0, 0, 0);
            var array = new Array();
            var rows = 0;
            var cols = 0;
            while (rows < 6) {
                rows++;
                while (cols < 7) {
                    cols++;
                    array.push({
                        rows: rows,
                        cols: cols,
                        dateVal: new Date(firstDate)
                    });
                    firstDate.setDate(firstDate.getDate() + 1);
                }
                cols = 0;
            }
            return array;
        },
        // 转换星期天
        changeSunday = function(val) {
            return val == 0 ? 7 : val;
        },
        // 格式化周
        formatWeek = function(date) {
            var y = date.getFullYear();
            // 第一天
            var firstDate = new Date(y, 0, 1);
            // 第一天到选中日期的天数
            var theDay = Math.round((date.getTime() - firstDate.getTime()) / 86400000);
            // 除于7得到周数
            var theWeeks = Math.ceil((theDay + ((firstDate.getDay() + 1) - 1)) / 7);
            // 第一天不是星期一则推迟一周为第一周
            if (firstDate.getDay() != 1) {
                theWeeks--;
            }
            if (theWeeks < 10) {
                theWeeks = "0" + theWeeks;
            }
            return y + '-' + theWeeks;
        },
        // 根据周序号获取星期一和星期天
        getMonDayAndSunDay = function(weekth) {
            if (weekth == null || weekth == '' || weekth.length != 6) {
                return '';
            }
            var y = weekth.substr(0, 4),
                w = weekth.substr(4);
            // 第一天
            var firstDate = new Date(parseInt(y, 10), 0, 1);
            // 第一周周一
            if (firstDate.getDay() != 1) {
                firstDate.setDate(firstDate.getDate() + 8 - changeSunday(firstDate.getDay()));
            }
            // 选择周周一
            firstDate.setDate(firstDate.getDate() + 7 * parseInt(w - 1, 10));
            var monday = formatDays(firstDate);
            // 选择周周日
            firstDate.setDate(firstDate.getDate() + 6);
            var sunday = formatDays(firstDate);
            return monday + ',' + sunday;
        },
        // 格式化日期
        formatDays = function(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            return y + '-' + fixZore(m) + '-' + fixZore(d);
        },
        // 个位补0
        fixZore = function(val) {
            if (val < 10) {
                return '0' + val;
            }
            return val;
        };
})(jQuery);

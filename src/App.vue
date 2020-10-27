<template>
  <div id="app">
    <el-input placeholder="请输入待办事项" class="td-input" :value="inputValue" @input="handleInputChange"></el-input>
    <el-button type="primary" @click="addItemToList">添加事项</el-button>
    <el-main class="td-main" >
        <el-table
          ref="multipleTable"
          :data="infolist"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @select="statusChanged"
          @select-all="statusChangedAll">
          <el-table-column
            type="selection"
            width="55"
            >
          </el-table-column>
          <el-table-column
            label="待办事项"
            width="350">
            <!-- 数据渲染 -->
            <template slot-scope="item">{{ item.row.info }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="删除"
            width="50">
            <el-button slot-scope="item" @click="removeItemById(item.row.id)" size="mini" class="btn-close" type="primary" icon="el-icon-close" circle></el-button>
          </el-table-column>
        </el-table>
        <div class="footer">
          <span>{{unDoneLength}}条剩余</span>
          <el-radio-group size="small" v-model="radio1" @change="changeList">
            <el-radio-button class="btn-radio" label="全部"></el-radio-button>
            <el-radio-button class="btn-radio" label="未完成"></el-radio-button>
            <el-radio-button class="btn-radio" label="已完成"></el-radio-button>
          </el-radio-group>
          <el-button @click="clean">清除已完成</el-button>
        </div>
    </el-main>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      radio1: '全部'
    }
  },
  created () {
    this.$store.dispatch('getList')
  },
  computed: {
    ...mapState(['list', 'inputValue', 'viewKey']),
    ...mapGetters(['unDoneLength', 'infolist'])
  },
  methods: {
    // 监听文本框内容的变化
    handleInputChange (val) {
      this.$store.commit('setInputValue', val)
    },
    // 向列表中新增 item 项
    addItemToList () {
      if (this.inputValue.trim().length <= 0) {
        return this.$message.warning('添加事项不能为空！')
      }
      this.$store.commit('addItem')
    },
    // 很据Id删除对应的任务事项
    removeItemById (id) {
      this.$store.commit('removeItem', id)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 复选框状态绑定
    checked () {
      this.$nextTick(() => {
        this.list.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, row.done)
        })
      })
    },
    // 监听复选框选中状态变化事件
    statusChanged (val, row) {
      const param = {
        id: row.id,
        // 点击后状态取反
        status: !row.done
      }
      this.$store.commit('changeStatus', param)
    },
    statusChangedAll (val) {
      if (val.length !== 0) {
        this.$store.commit('changeStatusAll')
      } else {
        this.$store.commit('cleanStatusAll')
      }
    },
    // 清除已完成任务
    clean () {
      this.$store.commit('cleanDone')
    },
    // 修改页面上展示的列表数据
    changeList (key) {
      this.$store.commit('changeViewKey', key)
    }
  },
  watch: {
    infolist: function (val) {
      this.checked()
    }
  }
}
</script>

<style>
#app {
  width: 610px;
  margin: 0 auto;
}
.td-input {
  width: 500px;
  margin-right: 10px;
}
.td-main {
  width: 500px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
}
.btn-close {
  float: right;
}
.el-button--mini.is-circle {
  padding: 3px;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}
</style>

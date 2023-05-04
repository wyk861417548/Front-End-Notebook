<template>
	<div class="c-code">
		<div class="verifyCode" :class="verifica.test(phone)?'':'ban'" v-show="show" @click="setCountdown" >验证码</div>
		<div class="verifyCode down" v-show="!show">{{count}}</div>
	</div>
</template>

<script>
	export default {
		props:['phone'],
		data() {
			return {
				// 手机正则验证
				verifica: /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/,
				
				show:true,
				
				//倒计时
				count:0,
				
				//定时器
				timer:null
			};
		},
		created() {
		},
		
		methods:{
			//设置倒计时   以及获取验证码
			setCountdown(){
				this.$emit("getCode");
				const TIME_COUNT = 60;  //倒计时的时间
				if(!this.timer){
					this.show = false;   //倒计时显示
					this.count = TIME_COUNT;
				 
					this.timer = setInterval(()=>{
						if(this.count > 1 && this.count <= TIME_COUNT){
							this.count--;
						}else{
							this.show = true;
							// 清除定时器  一定后面两句都要写
							clearInterval(this.timer);
							this.timer = null;
						}
					},1000)
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.c-code{
		height: 40px;
		width: 75px;
		.down{
			height: 100%;
			width: 100%;
			background:#ddd !important;
		}
		/* 验证码 */
		.verifyCode{line-height:40px;border-radius:4px;background-color:#41c39e;color:#fff;text-align:center;}
		.ban{background: #ddd !important;pointer-events: none;}
	}
</style>

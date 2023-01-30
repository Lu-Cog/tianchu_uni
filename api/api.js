import request from "./request.js"

export function getDocList(data){
	return request.get('doc/list',data)
}


export function getDocAct(data){
	return request.post('doc/act',data)
}


export function getDakaInfo(data){
	return request.get('daka/info',data)
}


export function getDakaAct(data){
	return request.post('daka/act',data)
}

export function getDakaList(data){
	return request.get('daka/list',data)
}

export function getHolidayList(data){
	return request.get('holiday/list',data)
}

export function getHolidayDetail(data){
	return request.get('holiday/detail',data)
}

export function getHolidayAct(data){
	return request.post('holiday/act',data)
}

export function getHolidayAdd(data){
	return request.post('holiday/add',data)
}

export function getFlieAdd(data){
	return request.post('doc',data)
}

export function getAreaInfo(data){
	return request.get('area/info',data)
}

export function getAreaList(data){
	return request.get('area/plist',data)
}

export function getDictDetail(data){
	return request.get('holiday/cate',data)
}

export function getHcancel(data){
	return request.post('holiday/cancel',data)
}

export function getUserInfo(data){
	return request.get('users/info',data)
}
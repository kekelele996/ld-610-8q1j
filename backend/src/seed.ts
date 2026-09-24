export const seed = {
  "relicItem": [
    {
      "id": 1,
      "relic_code": "YQ-001",
      "name": "青花缠枝莲纹梅瓶",
      "era": "明永乐",
      "material": "瓷器",
      "collection_level": "一级",
      "storage_location": "一号库房 A-12",
      "current_condition": "FRAGILE"
    },
    {
      "id": 2,
      "relic_code": "TQ-007",
      "name": "彩绘陶仕女俑",
      "era": "唐",
      "material": "陶",
      "collection_level": "二级",
      "storage_location": "二号库房 B-03",
      "current_condition": "IN_RESTORATION"
    },
    {
      "id": 3,
      "relic_code": "SQ-013",
      "name": "鎏金铜释迦坐像",
      "era": "宋",
      "material": "铜鎏金",
      "collection_level": "一级",
      "storage_location": "精品库房 C-08",
      "current_condition": "STABLE"
    }
  ],
  "damageRecord": [
    {
      "id": 1,
      "relic_id": 1,
      "damage_type": "釉面开裂",
      "position_desc": "腹部正面有一条纵向冲线，长约 6cm",
      "severity": "HIGH",
      "discovered_by": "修复师甲",
      "discovered_at": "2026-08-02T09:00:00Z",
      "image_url": "/mock/damage-1.png",
      "status": "REGISTERED"
    },
    {
      "id": 2,
      "relic_id": 2,
      "damage_type": "彩绘起甲",
      "position_desc": "左肩及发髻处彩绘片状起翘",
      "severity": "MEDIUM",
      "discovered_by": "修复师丙",
      "discovered_at": "2026-07-15T09:00:00Z",
      "image_url": "/mock/damage-2.png",
      "status": "IN_RESTORATION"
    },
    {
      "id": 3,
      "relic_id": 3,
      "damage_type": "鎏金锈蚀",
      "position_desc": "底座边缘点状锈蚀",
      "severity": "LOW",
      "discovered_by": "档案员丁",
      "discovered_at": "2026-08-20T09:00:00Z",
      "image_url": "/mock/damage-3.png",
      "status": "REGISTERED"
    },
    {
      "id": 4,
      "relic_id": 1,
      "damage_type": "口沿磕缺",
      "position_desc": "口沿处缺釉一块，约 1cm²",
      "severity": "CRITICAL",
      "discovered_by": "修复师甲",
      "discovered_at": "2026-08-25T09:00:00Z",
      "image_url": "/mock/damage-4.png",
      "status": "REGISTERED"
    },
    {
      "id": 5,
      "relic_id": 2,
      "damage_type": "陶胎裂隙",
      "position_desc": "底座背面细纹",
      "severity": "LOW",
      "discovered_by": "修复师丙",
      "discovered_at": "2026-06-10T09:00:00Z",
      "image_url": "/mock/damage-5.png",
      "status": "CLOSED"
    }
  ],
  "restorationPlan": [
    {
      "id": 1,
      "relic_id": 1,
      "damage_record_id": 1,
      "plan_title": "梅瓶腹部冲线修复方案",
      "method": "清洗断面后以环氧树脂灌注黏合，随色作旧，自然养护 72 小时。",
      "risk_assessment": "灌注压力过大可能导致釉面新裂，需分次低压注入并全程固定。",
      "approval_status": "SUBMITTED",
      "owner_id": 1,
      "owner_name": "修复师甲",
      "submitted_at": "2026-09-01T03:00:00Z",
      "approved_by": null,
      "approved_at": null,
      "rejection_reason": null,
      "created_at": "2026-08-30T08:00:00Z",
      "updated_at": "2026-09-01T03:00:00Z"
    },
    {
      "id": 2,
      "relic_id": 2,
      "damage_record_id": 2,
      "plan_title": "仕女俑彩绘回贴方案",
      "method": "以 3% B72 丙酮溶液缓慢渗透，回贴起甲彩绘，棉签滚压排气。",
      "risk_assessment": "溶剂挥发快，需控制单次用量，避免彩绘晕色。",
      "approval_status": "APPROVED",
      "owner_id": 2,
      "owner_name": "修复师丙",
      "submitted_at": "2026-07-20T02:00:00Z",
      "approved_by": "专家乙",
      "approved_at": "2026-07-22T06:30:00Z",
      "rejection_reason": null,
      "created_at": "2026-07-18T08:00:00Z",
      "updated_at": "2026-07-22T06:30:00Z"
    },
    {
      "id": 3,
      "relic_id": 1,
      "damage_record_id": 4,
      "plan_title": "口沿缺釉补配方案（草稿）",
      "method": "拟用瓷粉与可逆树脂配补，待确认配比。",
      "risk_assessment": "待定稿。",
      "approval_status": "DRAFT",
      "owner_id": 1,
      "owner_name": "修复师甲",
      "submitted_at": null,
      "approved_by": null,
      "approved_at": null,
      "rejection_reason": null,
      "created_at": "2026-09-05T08:00:00Z",
      "updated_at": "2026-09-05T08:00:00Z"
    },
    {
      "id": 4,
      "relic_id": 2,
      "damage_record_id": 5,
      "plan_title": "底座细纹加固方案",
      "method": "直接以高浓度 B72 灌缝加固。",
      "risk_assessment": "未评估溶剂对周边彩绘的影响。",
      "approval_status": "REJECTED",
      "owner_id": 2,
      "owner_name": "修复师丙",
      "submitted_at": "2026-06-14T02:00:00Z",
      "approved_by": null,
      "approved_at": null,
      "rejection_reason": "加固材料浓度过高且缺少彩绘影响评估，请补充试验记录后重新提交。",
      "created_at": "2026-06-12T08:00:00Z",
      "updated_at": "2026-06-15T01:00:00Z"
    }
  ],
  "restorationStep": [
    {
      "id": 1,
      "plan_id": 2,
      "step_order": "1",
      "technique": "彩绘渗透回贴",
      "material_used": "3% B72 丙酮溶液",
      "operator_id": 2,
      "step_status": "FINISHED",
      "finished_at": "2026-08-01T09:00:00Z"
    }
  ],
  "imageVersion": [
    {
      "id": 1,
      "relic_id": 2,
      "plan_id": 2,
      "version_no": "V1",
      "image_type": "BEFORE",
      "file_path": "/mock/image-before-1.png",
      "capture_at": "2026-07-16T09:00:00Z",
      "note": "修复前左肩起甲"
    },
    {
      "id": 2,
      "relic_id": 2,
      "plan_id": 2,
      "version_no": "V2",
      "image_type": "AFTER",
      "file_path": "/mock/image-after-1.png",
      "capture_at": "2026-08-02T09:00:00Z",
      "note": "回贴后彩绘稳定"
    }
  ]
};

package com.learn2hire.controller;

import com.learn2hire.dto.ApiResponse;
import com.learn2hire.model.Notification;
import com.learn2hire.model.User;
import com.learn2hire.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getNotifications(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false, defaultValue = "false") boolean unread) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("notifications", notificationService.getNotifications(user.getId(), unread));
        data.put("unreadCount", notificationService.getUnreadCount(user.getId()));
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Object>> markAsRead(
            @PathVariable String id, @AuthenticationPrincipal User user) {
        Notification n = notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(n, "Notification marked as read"));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Object>> markAllAsRead(@AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "All notifications marked as read"));
    }
}

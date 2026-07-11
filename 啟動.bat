@echo off
chcp 65001 >nul
title ChipForge 8BIT 音樂工坊
echo.
echo   ⚒ ChipForge 啟動中…
echo   瀏覽器開啟 http://localhost:8213
echo   （關閉此視窗即停止伺服器）
echo.
start "" http://localhost:8213
python -m http.server 8213 --directory "%~dp0"

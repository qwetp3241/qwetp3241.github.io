/**
 * 셀프 지압 도구 3종 랜딩 페이지 스크립트
 * 01-landing-page-plan.md 및 taste-skill 규격 준수
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 상품 공통 데이터 모델
  const PRODUCTS = {
    gguk: {
      key: 'gguk',
      name: '더꾹 흡착 마사지볼',
      price: '8,860원',
      summary: '더꾹 흡착 마사지볼 · 8,860원',
      url: 'https://link.coupang.com/a/hCfg8Q3gRw'
    },
    ovnic: {
      key: 'ovnic',
      name: '오브닉 흡착 마사지볼 2개 세트',
      price: '9,400원',
      summary: '오브닉 흡착 마사지볼 2개 세트 · 9,400원',
      url: 'https://link.coupang.com/a/hCfj7cnRfg'
    },
    ongo: {
      key: 'ongo',
      name: '온고장인 등나무 갈고리',
      price: '8,500원',
      summary: '온고장인 등나무 갈고리 · 8,500원',
      url: 'https://link.coupang.com/a/hCfmg1QdvE'
    }
  };

  // 기본 선택 상품: 더꾹 (gguk)
  let currentSelectedKey = 'gguk';

  // DOM 요소 캐시
  const header = document.getElementById('site-header');
  const heroSelectedName = document.getElementById('hero-selected-name');
  const heroChips = document.querySelectorAll('.hero-chip-card');
  const finalChoiceCards = document.querySelectorAll('.final-choice-card');
  const finalSummaryText = document.getElementById('final-summary-text');
  const scrollIndicator = document.getElementById('hero-scroll-indicator');
  const ctaButtons = document.querySelectorAll('.cta-action-btn');
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  const cardSelectBtns = document.querySelectorAll('[data-select-product]');

  /**
   * 2. 전역 상품 선택 상태 동기화 함수
   * @param {string} productKey - 'gguk' | 'ovnic' | 'ongo'
   * @param {boolean} shouldFlashFinalCard - cta-final 카드를 반짝 강조할지 여부
   */
  function setProductSelection(productKey, shouldFlashFinalCard = false) {
    if (!PRODUCTS[productKey]) return;
    currentSelectedKey = productKey;
    const prod = PRODUCTS[productKey];

    // 히어로 '지금 선택' 텍스트 갱신
    if (heroSelectedName) {
      heroSelectedName.textContent = prod.name;
    }

    // 히어로 칩 활성화 상태 동기화
    heroChips.forEach(chip => {
      const match = chip.dataset.product === productKey;
      chip.classList.toggle('is-active', match);
      if (match) {
        chip.setAttribute('aria-selected', 'true');
      } else {
        chip.removeAttribute('aria-selected');
      }
    });

    // 최하단 CTA 라디오 카드 동기화
    finalChoiceCards.forEach(card => {
      const match = card.dataset.product === productKey;
      card.classList.toggle('is-selected', match);
      const radioInput = card.querySelector('input[type="radio"]');
      if (radioInput) {
        radioInput.checked = match;
      }

      if (match && shouldFlashFinalCard) {
        card.classList.remove('highlight-flash');
        // 트리거 리플로우
        void card.offsetWidth;
        card.classList.add('highlight-flash');
        setTimeout(() => {
          card.classList.remove('highlight-flash');
        }, 650);
      }
    });

    // 최하단 선택 요약 줄 갱신
    if (finalSummaryText) {
      finalSummaryText.textContent = prod.summary;
    }

    // 두 CTA 링크를 선택한 상품의 쿠팡 파트너스 페이지로 갱신
    ctaButtons.forEach(btn => {
      btn.href = prod.url;
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'sponsored noopener');
      btn.setAttribute('aria-label', `${prod.name} 쿠팡에서 가격·옵션 확인하기 (새 탭)`);
    });
  }

  // 초기 상태 동기화
  setProductSelection(currentSelectedKey);

  // 3. 히어로 칩 클릭 이벤트
  heroChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const prodKey = chip.dataset.product;
      setProductSelection(prodKey);
    });
  });

  // 4. pick 섹션 & 디테일 섹션의 '고르기' 버튼 클릭
  cardSelectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prodKey = btn.dataset.selectProduct;
      if (prodKey) {
        const isDetailChooseBtn = btn.classList.contains('btn-choose-tool');
        if (isDetailChooseBtn) {
          // 디테일 '이 도구로 고르기': cta-final로 이동 후 카드 반짝 강조
          setProductSelection(prodKey, true);
          const ctaFinalSection = document.getElementById('cta-final');
          if (ctaFinalSection) {
            ctaFinalSection.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          // pick 섹션 '자세히 보기': 상품 선택 동기화
          setProductSelection(prodKey);
        }
      }
    });
  });

  // pick 카드 전체 영역 클릭 시 해당 상품 선택 및 디테일 섹션으로 이동
  const pickCards = document.querySelectorAll('.pick-card');
  pickCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const prodKey = card.dataset.product;
      if (prodKey) {
        setProductSelection(prodKey);
        if (!e.target.closest('a')) {
          const targetDetail = document.getElementById(`detail-${prodKey}`);
          if (targetDetail) {
            targetDetail.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });

  // 5. 최하단 CTA 라디오 카드 클릭
  finalChoiceCards.forEach(card => {
    card.addEventListener('click', () => {
      const prodKey = card.dataset.product;
      setProductSelection(prodKey);
    });
  });

  // 6. CTA 버튼: <a target="_blank">라 클릭 시 선택 상품의 쿠팡 페이지가 새 탭으로 열림 (href는 setProductSelection에서 갱신)

  // 7. FAQ 아코디언 토글 (복수 개 오픈 가능)
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const contentId = trigger.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      const icon = trigger.querySelector('.faq-icon');

      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        if (content) content.hidden = true;
        if (icon) icon.textContent = '+';
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        if (content) content.hidden = false;
        if (icon) icon.textContent = '−';
      }
    });
  });

  // 8. 스크롤 감지: 헤더 보더 표시 & 스크롤 유도 화살표 페이드아웃
  let hasScrolledOnce = false;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // 헤더 보더 토글
    if (scrollY > 20) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }

    // 스크롤 인디케이터 서서히 사라짐
    if (!hasScrolledOnce && scrollY > 60) {
      hasScrolledOnce = true;
      if (scrollIndicator) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      }
    }
  }, { passive: true });

  // 9. 넛지 장치: 페이지 로드 1.2초 후 칩 1->2->3 0.4초 간격 순차 강조
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && heroChips.length > 0) {
    setTimeout(() => {
      heroChips.forEach((chip, index) => {
        setTimeout(() => {
          chip.classList.add('pulse-highlight');
          setTimeout(() => {
            chip.classList.remove('pulse-highlight');
          }, 600);
        }, index * 400);
      });
    }, 1200);
  }
});

/**
 * 10. 전역 이미지 에러 폴백 처리기
 * 이미지 로드 실패 시 같은 크기의 '이미지 준비 중' 플레이스홀더로 대체
 */
function handleImageError(imgElement) {
  if (!imgElement || imgElement.dataset.hasHandledError) return;
  imgElement.dataset.hasHandledError = 'true';

  const placeholder = document.createElement('div');
  placeholder.className = 'image-fallback-placeholder';
  placeholder.textContent = '이미지 준비 중';
  placeholder.setAttribute('role', 'img');
  placeholder.setAttribute('aria-label', imgElement.alt || '이미지 준비 중');

  // 부모 노드 교체
  if (imgElement.parentNode) {
    imgElement.parentNode.insertBefore(placeholder, imgElement);
    imgElement.style.display = 'none';
  }
}

// 전역 스코프에 노출
window.handleImageError = handleImageError;

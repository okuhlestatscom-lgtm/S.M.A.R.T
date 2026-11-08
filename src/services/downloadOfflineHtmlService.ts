/**
 * S.M.A.R.T Offline HTML Downloader Service
 * Allows users to download the self-contained standalone HTML portal with all
 * books, teachings, audio/video links, prayer journals, and calendar intact.
 */

export const downloadOfflineHtmlService = {
  /**
   * Triggers download of the standalone single-file HTML portal.
   */
  async downloadStandaloneHtml(customFilename?: string): Promise<boolean> {
    try {
      const filename = customFilename || 'smart-portal-apostle-nicholas-offline.html';
      const response = await fetch('/smart-portal-offline.html');
      
      if (!response.ok) {
        throw new Error('Failed to fetch offline HTML template');
      }

      const htmlText = await response.text();
      const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error('Error downloading offline HTML:', err);
      // Fallback: direct window anchor trigger
      const link = document.createElement('a');
      link.href = '/smart-portal-offline.html';
      link.download = customFilename || 'smart-portal-apostle-nicholas-offline.html';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    }
  }
};
